import { Referral } from 'src/modules/referral/referral.domain';
import { User } from '../user.domain';

export interface UserReferralAttributes {
  id: number;
  user: number;
  referral: number;
  referred: string;
  startDate: Date;
  expirationDate: Date;
  applied: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export const UserReferralTypes = ['storage'];
export class UserReferral implements UserReferralAttributes {
  id: number;
  user: number;
  referral: number;
  referred: string;
  startDate: Date;
  expirationDate: Date;
  applied: boolean;
  createdAt: Date;
  updatedAt: Date;
  constructor({
    id,
    user,
    referral,
    referred,
    startDate,
    expirationDate,
    applied,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.setUser(user);
    this.setReferral(referral);
    this.referred = referred;
    this.setPeriod(startDate, expirationDate);
    this.applied = applied;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static build(userReferral: UserReferralAttributes): UserReferral {
    return new UserReferral(userReferral);
  }

  setUser(user) {
    if (user && !(user instanceof User)) {
      throw Error('user invalid');
    }
    this.user = user;
  }
  setReferral(referral) {
    if (referral && !(referral instanceof Referral)) {
      throw Error('referral invalid');
    }
    this.referral = referral;
  }

  setPeriod(startDate, expirationDate) {
    if (expirationDate < startDate) {
      throw new Error('ExpirationDate greather tan startDate');
    }
    this.startDate = startDate;
    this.expirationDate = expirationDate;
  }

  toJSON() {
    return {
      id: this.id,
      user: this.user,
      referral: this.referral,
      referred: this.referred,
      startDate: this.startDate,
      expirationDate: this.expirationDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
