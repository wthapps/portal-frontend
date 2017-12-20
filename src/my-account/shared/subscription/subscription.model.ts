import { BaseEntity } from '@wth/shared/shared/models/base-entity.model';

class Subscription extends BaseEntity {
  accountCount: number;
  accountAmount: any;
  billingDate: any;
}
