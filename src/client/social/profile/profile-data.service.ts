import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
 * This class provides the ZSocialProfileService service with methods to read info and add info.
 */
@Injectable()
// Passing data between parent profile component and its children
export class ZSocialProfileDataService {
  profileData$: Observable<any>;
  private profileData: Subject<any> = new BehaviorSubject<any>({ userInfo: '', actions: []});

  constructor() {
    this.profileData$ = this.profileData.asObservable();
  }

  addData(data:any) {
    this.profileData.next(data);
  }
}

