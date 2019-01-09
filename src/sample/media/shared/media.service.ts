import { Injectable } from '@angular/core';
import { ApiBaseService } from '@wth/shared/services';

@Injectable()
export class SampleMediaService {
  constructor(protected api: ApiBaseService) {
  }

  getData(next: string) {
    const url = next ? next : 'media/media/index_combine';
    return this.api.get(url);
  }
}
