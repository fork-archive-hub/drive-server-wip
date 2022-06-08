export class Share {
  id: number;
  token: string;
  mnemonic: string;
  user: number;
  file: string;
  encryptionKey: string;
  bucket: string;
  fileToken: string;
  isFolder: boolean;
  views: number;
  constructor({
    id,
    token,
    mnemonic,
    user,
    file,
    encryptionKey,
    bucket,
    fileToken,
    isFolder,
    views,
  }) {
    this.id = id;
    this.token = token;
    this.mnemonic = mnemonic;
    this.user = user;
    this.file = file;
    this.encryptionKey = encryptionKey;
    this.bucket = bucket;
    this.fileToken = fileToken;
    this.isFolder = isFolder;
    this.views = views;
  }

  static build({
    id,
    token,
    mnemonic,
    user,
    file,
    encryptionKey,
    bucket,
    fileToken,
    isFolder,
    views,
  }) {
    return new Share({
      id,
      token,
      mnemonic,
      user,
      file,
      encryptionKey,
      bucket,
      fileToken,
      isFolder,
      views,
    });
  }

  toJSON() {
    return {
      id: this.id,
      token: this.token,
      mnemonic: this.mnemonic,
      user: this.user,
      file: this.file,
      encryptionKey: this.encryptionKey,
      bucket: this.bucket,
      fileToken: this.fileToken,
      isFolder: this.isFolder,
      views: this.views,
    };
  }

}