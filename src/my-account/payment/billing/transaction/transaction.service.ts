import { Injectable } from '@angular/core';
import { ApiBaseService } from '@shared/services/apibase.service';

@Injectable()
export class TransactionService {

  path = 'account/payment/transactions';

  constructor(private apiBaseService: ApiBaseService) {
  }

  getAll(): any {
    return this.apiBaseService.get(`${this.path}`);
  }

  get(id: string): any {
    return this.apiBaseService.get(`${this.path}/${id}`);
  }
}

