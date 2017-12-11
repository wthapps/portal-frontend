import { Injectable } from '@angular/core';
import { ApiBaseService } from '@wth/shared/shared/services/apibase.service';

@Injectable()
export class MyTransactionService {

  constructor(private apiBaseService: ApiBaseService) {
  }

  list(idUser: any): any {
    return this.apiBaseService.get(`users/${idUser}/transactions`);
  }

  detail(id: any, idUser: any): any {
    return this.apiBaseService.get(`users/${idUser}/transactions/${id}`);
  }
}

