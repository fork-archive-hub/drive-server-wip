import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/user.domain';
import { UserModel } from '../user/user.repository';
import { SendLink, SendLinkAttributes } from './send-link.domain';
import { SendLinkItem } from './send-link-item.domain';

import {
  Column,
  Model,
  Table,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  DataType,
  AllowNull,
  HasMany,
  Sequelize,
} from 'sequelize-typescript';
import {
  getStringFromBinary,
  convertStringToBinary,
} from '../../lib/binary-converter';
import { sortBy } from 'lodash';

const ENCRYPTION_DATE_RELEASE = new Date('2022-07-05 13:55:00');
@Table({
  underscored: true,
  timestamps: true,
  tableName: 'send_links',
})
export class SendLinkModel extends Model {
  @PrimaryKey
  @Column
  id: string;

  @Column
  views: number;

  @ForeignKey(() => UserModel)
  @Column
  userId: number;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @Column
  sender: string;

  @Column
  receivers: string;

  @Column
  code: string;

  @Column
  title: string;

  @Column
  subject: string;

  @Column
  expirationAt: Date;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;

  @HasMany(() => SendLinkItemModel)
  items: SendLinkItemModel[];
}

@Table({
  underscored: true,
  timestamps: true,
  tableName: 'send_links_items',
})
export class SendLinkItemModel extends Model {
  @PrimaryKey
  @Column
  id: string;

  @Column
  name: string;

  @Column
  type: string;

  @ForeignKey(() => SendLinkModel)
  @Column
  linkId: number;

  @BelongsTo(() => SendLinkModel)
  link: any;

  @AllowNull
  @Column
  networkId: string;

  @Column(DataType.STRING(64))
  encryptionKey: string;

  @Column(DataType.INTEGER.UNSIGNED)
  size: number;

  @Column
  path: string;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}

export interface SendRepository {
  findById(id: SendLinkAttributes['id']): Promise<SendLink | null>;
  update(sendLink: SendLink): void;
}

@Injectable()
export class SequelizeSendRepository implements SendRepository {
  constructor(
    @InjectModel(SendLinkModel)
    private sendLinkModel: typeof SendLinkModel,
    @InjectModel(SendLinkItemModel)
    private sendLinkItemModel: typeof SendLinkItemModel,
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
    private sequelize: Sequelize,
  ) {}

  async findById(id: SendLinkAttributes['id']) {
    const sendLink = await this.sendLinkModel.findByPk(id, {
      include: [this.userModel, this.sendLinkItemModel],
    });
    return sendLink ? this.toDomain(sendLink) : null;
  }

  async createSendLinkWithItems(sendLink: SendLink): Promise<void> {
    const sendLinkModel = this.toModel(sendLink);
    const transaction = await this.sequelize.transaction();
    const childs = [];
    sendLinkModel.items.forEach((item) => {
      childs.push(item);
      const childrens = this.getChildrens(item);
      childs.push(...childrens);
    });
    try {
      await this.sendLinkModel.create(sendLinkModel, { transaction });
      await this.sendLinkItemModel.bulkCreate(childs, {
        transaction,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async update(sendLink: SendLink): Promise<void> {
    const sendLinkModel = await this.sendLinkModel.findByPk(sendLink.id);
    if (!sendLinkModel) {
      throw new NotFoundException(`sendLink with ID ${sendLink.id} not found`);
    }
    sendLinkModel.set(this.toModel(sendLink));
    await sendLinkModel.save();
  }

  private toDomain(model): any {
    if (
      model.title &&
      model.subject &&
      model.createdAt > ENCRYPTION_DATE_RELEASE
    ) {
      model.title = getStringFromBinary(atob(model.title));
      model.subject = getStringFromBinary(atob(model.subject));
    }

    const sendLink = SendLink.build({
      id: model.id,
      views: model.views,
      user: model.user ? User.build(model.user) : null,
      items: [],
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      sender: model.sender,
      receivers: model.receivers ? model.receivers.split(',') || [] : null,
      code: model.code,
      title: model.title,
      subject: model.subject,
      expirationAt: model.expirationAt,
    });

    const grouped = [];

    sortBy(model.items, (item) => item.path.split('/').length).forEach(
      (item) => {
        const itemParsed = item.toJSON();
        itemParsed.childrens = [];
        this.generateChildrens(grouped, itemParsed);
      },
    );
    sendLink.setItems(grouped);
    return sendLink;
  }

  private toDomainItem(model): SendLinkItem {
    const pathArray = model.path.split('/');
    let parentId = null;
    if (pathArray.length > 1) {
      parentId = pathArray[pathArray.length - 2];
    }

    if (model.createdAt > ENCRYPTION_DATE_RELEASE) {
      model.name = getStringFromBinary(atob(model.name));
    }

    return SendLinkItem.build({
      id: model.id,
      type: model.type,
      name: model.name,
      linkId: model.linkId,
      networkId: model.networkId,
      encryptionKey: model.encryptionKey,
      size: model.size,
      parentId,
      childrens: [],
      path: model.path,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  private generateChildrens(items, currentItem) {
    let isChild = false;
    const pathArray = currentItem.path.split('/');
    const parentId = pathArray[pathArray.length - 2];
    items.forEach((item) => {
      if (item.id === parentId) {
        const children = item.childrens.find(
          (child) => child.id === currentItem.id,
        );
        if (!children) {
          isChild = true;
          item.childrens.push(this.toDomainItem(currentItem));
        }
      } else {
        isChild = true;
        if (item.childrens.length > 0) {
          this.generateChildrens(item.childrens, currentItem);
        }
      }
    });
    if (!isChild) {
      items.push(this.toDomainItem(currentItem));
    }
    return items;
  }

  private toModel({
    id,
    views,
    user,
    items,
    sender,
    receivers,
    code,
    title,
    subject,
    expirationAt,
    createdAt,
    updatedAt,
  }) {
    if (title && subject && createdAt > ENCRYPTION_DATE_RELEASE) {
      title = btoa(convertStringToBinary(title));
      subject = btoa(convertStringToBinary(subject));
    }
    return {
      id,
      views,
      userId: user ? user.id : null,
      items: items.map((item) => this.toModelItem(item)),
      sender,
      receivers: receivers ? receivers.join(',') : null,
      code,
      title,
      subject,
      expirationAt,
      createdAt,
      updatedAt,
    };
  }

  private toModelItem(domain) {
    if (domain.createdAt > ENCRYPTION_DATE_RELEASE) {
      domain.name = btoa(convertStringToBinary(domain.name));
    }
    return {
      id: domain.id,
      name: domain.name,
      type: domain.type,
      linkId: domain.linkId,
      networkId: domain.networkId,
      encryptionKey: domain.encryptionKey,
      path: domain.path,
      size: domain.size,
      childrens: domain.childrens.map((child) => this.toModelItem(child)),
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  private getChildrens(item) {
    const childrens = [];
    if (item.childrens) {
      item.childrens.forEach((child) => {
        childrens.push(child);
        childrens.push(...this.getChildrens(child));
      });
    }
    return childrens;
  }
}
