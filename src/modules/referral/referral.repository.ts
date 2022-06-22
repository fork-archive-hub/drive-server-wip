import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Folder } from '../folder/folder.domain';
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  Default,
  AutoIncrement,
  Unique,
} from 'sequelize-typescript';

@Table({
  underscored: true,
  timestamps: true,
  tableName: 'referrals',
})
export class ReferralModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Unique
  @Column
  key: string;

  @Column
  type: string;

  @Column
  credit: number;

  @Column
  steps: number;

  @Default(true)
  @Column
  enabled: boolean;
}

export interface ReferralRepository {
  findByKey(key: string): Promise<any>;
}

@Injectable()
export class SequelizeReferralRepository implements ReferralRepository {
  constructor(
    @InjectModel(ReferralModel)
    private modelReferral: typeof ReferralModel,
  ) {}

  async findByKey(key: string): Promise<User | null> {
    const referral = await this.modelReferral.findOne({
      where: {
        key,
      },
    });
    return referral ? this.toDomain(referral) : null;
  }

  toDomain(model: UserModel): User {
    return User.build({
      ...model.toJSON(),
      rootFolder: model.rootFolder ? Folder.build(model.rootFolder) : null,
    });
  }

  toModel(domain: User): Partial<UserAttributes> {
    return domain.toJSON();
  }
}
