import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../../shared/services/apibase.service';

/**
 * Created by phat on 18/11/2016.
 */
@Injectable()
export class SoSearchService {
  constructor(private apiBaseService: ApiBaseService) {
  }

  search(text:string, types:any) {
    return this.apiBaseService.post('zone/social_network/search', {text: text, types: types});
  }

  saveKey(text:string) {
    return this.apiBaseService.post('zone/social_network/search/save_key', {key: text});
  }
}

