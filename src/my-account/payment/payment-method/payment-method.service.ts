import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService, BaseEntityService } from '@shared/services';

@Injectable()
export class PaymentMethodService extends BaseEntityService<any> {
  path = 'account/payment_methods';
  constructor(protected apiBaseService: ApiBaseService) {
    super(apiBaseService);
  }

  get(id: any): Observable<any> {
    return this.apiBaseService.get(`${this.path}/${id}`);
  }

  getCurrent(): Observable<any> {
    return this.apiBaseService.get(`${this.path}/get_current`);
  }

  create(paymentMethod: any): Observable<any> {
    return this.apiBaseService.post(`${this.path}`, {payment_method: paymentMethod});
  }

  update(paymentMethod: any): Observable<any> {
    const url = `${this.path}/${paymentMethod.uuid}`;
    return this.apiBaseService.patch(url, { payment_method: paymentMethod });
  }
}
