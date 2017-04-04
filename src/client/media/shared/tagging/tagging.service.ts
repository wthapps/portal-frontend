import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';

@Injectable()
export class ZMediaTaggingService {
  constructor(private apiBaseService: ApiBaseService) {
  }

  getAll() {
    return this.apiBaseService.get(`zone/tags`);
  }

  getTags(keys:any) {
    return this.apiBaseService.get(`zone/tags`, {text: keys});
  }

  save(body: any) {
    return this.apiBaseService.put(`zone/tags/update`, body);
  }
}
