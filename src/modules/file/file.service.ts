import { Injectable } from '@nestjs/common';
import { CryptoService } from '../../services/crypto/crypto.service';
import { SequelizeFileRepository } from './file.repository';

@Injectable()
export class FileService {
  constructor(
    private fileRepository: SequelizeFileRepository,
    private cryptoService: CryptoService,
  ) {}

  async getByFolderAndUser(folderId: number, userId: string, deleted = false) {
    const files = await this.fileRepository.findAllByFolderIdAndUserId(
      folderId,
      userId,
      deleted,
    );

    const filesWithNameDecrypted = [];

    for (const file of files) {
      filesWithNameDecrypted.push({
        ...file,
        name: this.cryptoService.decryptName(file.name, folderId),
      });
    }

    return filesWithNameDecrypted;
  }

  async moveFilesToTrash(fileIds: string[], userId: string): Promise<void> {
    await this.fileRepository.updateManyByFieldIdAndUserId(fileIds, userId, {
      deleted: true,
      deletedAt: new Date(),
    });
  }

  moveFileToTrash(fileId: string, userId: string) {
    return this.fileRepository.updateByFieldIdAndUserId(fileId, userId, {
      deleted: true,
      deletedAt: new Date(),
    });
  }
}
