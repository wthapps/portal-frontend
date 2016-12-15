import { Injectable } from '@angular/core';
import { ApiBaseServiceV2 } from '../../../shared/services/apibase.service.v2';

/**
 * Created by phat on 18/11/2016.
 */
@Injectable()
export class SoSearchService {
  constructor(private apiBaseServiceV2: ApiBaseServiceV2) {
  }

  search(text:string, types:any) {
    return this.apiBaseServiceV2.post('zone/social_network/search', {text: text, types: types})
  }

  saveKey(text:string) {
    return this.apiBaseServiceV2.post('zone/social_network/search/save_key', {key: text})
  }
}

