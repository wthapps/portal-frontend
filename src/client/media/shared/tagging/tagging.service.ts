import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';

@Injectable()
export class ZMediaTaggingService {
  constructor(private apiBaseService: ApiBaseService) {
  }

  getAll() {
    return this.apiBaseService.get(`zone/tags`);
  }

  getByItem(body: any) {
    return this.apiBaseService.post(`zone/tags/get_tags`, body);
  }

  save(body: any) {
    return this.apiBaseService.put(`zone/tags/update`, body);
  }

  search(v: string) {
    console.log(v);
    // this.apiBaseService
  }
}
