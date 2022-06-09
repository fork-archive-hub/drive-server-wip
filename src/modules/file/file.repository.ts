import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File, FileAttributes } from './file.domain';
import { Op } from 'sequelize';

import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
  Index,
} from 'sequelize-typescript';
@Table({
  underscored: true,
  timestamps: true,
  tableName: 'files',
})
export class FileModel extends Model implements FileAttributes {
  @PrimaryKey
  @Column
  id: number;

  @Column(DataType.STRING(24))
  fileId: string;

  @Index
  @Column
  name: string;

  @Column
  type: string;

  @Column(DataType.BIGINT.UNSIGNED)
  size: bigint;

  @Column(DataType.STRING(24))
  bucket: string;

  @Column(DataType.INTEGER)
  folderId: number;

  @Column
  encryptVersion: string;

  @Column
  deleted: boolean;

  @Column
  deletedAt: Date;

  @Column
  userId: number;

  @Column
  modificationTime: Date;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}

export interface FileRepository {
  findAll(): Promise<Array<File> | []>;
  findAllByFolderIdAndUserId(
    folderId: FileAttributes['folderId'],
    userId: FileAttributes['userId'],
    deleted: FileAttributes['deleted'],
  ): Promise<Array<File> | []>;
  findOne(
    fileId: FileAttributes['fileId'],
    userId: FileAttributes['userId'],
  ): Promise<File | null>;
  updateByFieldIdAndUserId(
    fileId: FileAttributes['fileId'],
    userId: FileAttributes['userId'],
    update: Partial<File>,
  ): Promise<File>;
  updateManyByFieldIdAndUserId(
    fileIds: FileAttributes['fileId'][],
    userId: FileAttributes['userId'],
    update: Partial<File>,
  ): Promise<void>;
  _toDomain(model: FileModel): File;
  _toModel(domain: File): Partial<FileAttributes>;
}

@Injectable()
export class SequelizeFileRepository implements FileRepository {
  constructor(
    @InjectModel(FileModel)
    private fileModel: typeof FileModel,
  ) {}

  async findAll(): Promise<Array<File> | []> {
    const files = await this.fileModel.findAll();
    return files.map((file) => {
      return this._toDomain(file);
    });
  }
  async findAllByFolderIdAndUserId(
    folderId: FileAttributes['folderId'],
    userId: FileAttributes['userId'],
    deleted: FileAttributes['deleted'],
  ): Promise<Array<File> | []> {
    const files = await this.fileModel.findAll({
      where: { folderId, userId, deleted: deleted ? 1 : 0 },
    });
    return files.map((file) => {
      return this._toDomain(file);
    });
  }

  async findOne(
    fileId: FileAttributes['fileId'],
    userId: FileAttributes['userId'],
  ): Promise<File | null> {
    const file = await this.fileModel.findOne({
      where: {
        fileId,
        userId,
      },
    });
    return file ? this._toDomain(file) : null;
  }

  async updateByFieldIdAndUserId(
    fileId: FileAttributes['fileId'],
    userId: FileAttributes['userId'],
    update: Partial<File>,
  ): Promise<File> {
    const file = await this.fileModel.findOne({
      where: {
        fileId,
        userId,
      },
    });

    if (!file) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }
    file.set(update);
    await file.save();
    return this._toDomain(file);
  }

  async updateManyByFieldIdAndUserId(
    fileIds: FileAttributes['fileId'][],
    userId: FileAttributes['userId'],
    update: Partial<File>,
  ): Promise<void> {
    await this.fileModel.update(update, {
      where: {
        userId,
        fileId: {
          [Op.in]: fileIds,
        },
      },
    });
  }

  _toDomain(model: FileModel): File {
    const file = File.build(model.toJSON());
    return file;
  }

  _toModel(domain: File): Partial<FileAttributes> {
    return domain.toJSON();
  }
}
