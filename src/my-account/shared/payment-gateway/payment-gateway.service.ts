import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '@shared/services';

@Injectable()
export class PaymentGatewayService {
  path = 'account/payment_gateway';
  constructor(protected apiBaseService: ApiBaseService) { }

  getToken(): Observable<any> {
    return this.apiBaseService.get(`${this.path}/token`);
  }
}
