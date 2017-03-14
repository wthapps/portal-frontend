import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
// This Data service is created for communitication between social components: communities, notification, friends and its child views
export class SocialDataService {

  itemObs$ = this.itemSource.asObservable();
  loadingDone = false;

  private itemSource = new Subject<string>();

  loadItem(data: string = '') {
    this.itemSource.next(data);
  }

  resetLoading() {
    this.loadingDone = false;
  }

}
