import { Injectable } from '@nestjs/common';
import { ReferralAttributes } from './referral.domain';
import { SequelizeReferralRepository } from './referral.repository';

@Injectable()
export class ReferralUseCases {
  constructor(private referralRepository: SequelizeReferralRepository) {}
  async getByKey(key: ReferralAttributes['key']) {
    return await this.referralRepository.findByKey(key);
  }
}
