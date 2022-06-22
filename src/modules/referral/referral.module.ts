import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  SequelizeReferralRepository,
  ReferralModel,
} from './referral.repository';
import { ReferralUseCases } from './referral.usecase';

@Module({
  imports: [SequelizeModule.forFeature([ReferralModel])],
  controllers: [],
  providers: [SequelizeReferralRepository, ReferralUseCases],
  exports: [ReferralUseCases],
})
export class ReferralModule {}
