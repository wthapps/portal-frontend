import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
// This Data service is created for communitication between social components: communities, notification, friends and its child views
export class SocialDataService {
  itemObs$ : any;
  private itemSource = new Subject<string>();

  loadingDone = false;

  constructor() {
    this.itemObs$ = this.itemSource.asObservable();
  }

  loadItem(data: string = '') {
    this.itemSource.next(data);
  }

  resetLoading() {
    this.loadingDone = false;
  }

}
