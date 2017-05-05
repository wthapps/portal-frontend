import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../../../core/shared/services/apibase.service';

@Injectable()
export class ZoneReportService {
  set: (type: string, uuid: string) => Promise<boolean>;

  constructor(private apiBaseService: ApiBaseService) {

  }

  post(uuid: string = null) {
    this.set('post', uuid);
  }

  member(uuid: string = null) {
    this.set('member', uuid);
  }

  community(uuid: string = null) {
    this.set('community', uuid);
  }

  // TODO: Consider seperate between 'friend' and 'member' types
  friend(uuid: string = null) {
    // this.set('friend', uuid);
    this.set('member', uuid);
  }

  stop(uuid: string = null) {
    this.set('post', uuid);
  }

  show(item: any) {
    if (item.post)
      this.post(item.post.uuid);
    if (item.community)
      this.community(item.community.uuid);
    if (item.member)
      this.member(item.member.uuid);
    if (item.friend)
      this.friend(item.friend.uuid);
  }

  report(body: any) {
    return this.apiBaseService.post(`zone/social_network/userreports`, body);
  }
}

