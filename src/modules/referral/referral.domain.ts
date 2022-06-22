export interface ReferralAttributes {
  id: number;
  key: string;
  type: string;
  credit: number;
  steps: number;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export const ReferralTypes = ['storage'];
export class Referral implements ReferralAttributes {
  id: number;
  key: string;
  type: string;
  credit: number;
  steps: number;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  constructor({ id, key, type, credit, steps, enabled, createdAt, updatedAt }) {
    this.id = id;
    this.key = key;
    this.setType(type);
    this.credit = credit;
    this.steps = steps;
    this.enabled = enabled;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static build(share: ReferralAttributes): Referral {
    return new Referral(share);
  }

  setType(type) {
    if (!ReferralTypes.includes(type)) {
      throw new Error('referral type invalid');
    }
    this.type = type;
  }

  isEnabled() {
    return this.enabled;
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  toJSON() {
    return {
      id: this.id,
      key: this.key,
      type: this.type,
      credit: this.credit,
      steps: this.steps,
      enabled: this.enabled,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
