import { Injectable } from '@angular/core';

@Injectable()
export class ZoneReportService {
  set: (type: string, uuid: string) => Promise<boolean>;

  post(uuid: string = null) {
    this.set('post', uuid);
  }
  member(uuid: string = null) {
    this.set('member', uuid);
  }
  community(uuid: string = null) {
    this.set('community', uuid);
  }

  stop(uuid: string = null) {
    this.set('post', uuid);
  }
}

