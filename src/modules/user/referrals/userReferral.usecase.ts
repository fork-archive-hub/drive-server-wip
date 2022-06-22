import { Injectable, NotFoundException } from '@nestjs/common';

import { ReferralUseCases } from 'src/modules/referral/referral.usecase';
import { SequelizeUserRepository } from '../user.repository';
@Injectable()
export class UserReferralUseCases {
  constructor(
    private referralUseCases: ReferralUseCases,
    private userRepository: SequelizeUserRepository,
  ) {}

  async applyUserReferral(user, referralKey, referred) {
    const referral = await this.referralUseCases.getByKey(referralKey);
    if (!referral) {
      throw new NotFoundException('Referral not found');
    }
    const userReferral = false;
    if (!userReferral) {
      return;
    }
    // check appsumo here

    // update
    // redeemUserReferral
  }
}
