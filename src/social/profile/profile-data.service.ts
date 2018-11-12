import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';

/**
 * This class provides the ZSocialProfileService service with methods to read info and add info.
 */
@Injectable()
// Passing data between parent profile component and its children
export class ZSocialProfileDataService {
  profileData$: Observable<any>;
  private profileDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>({
    userInfo: '',
    actions: [],
    relationships: {}
  });

  constructor() {
    this.profileData$ = this.profileDataSubject.asObservable();
  }

  addData(data: any) {
    this.profileDataSubject.next(data);
  }

  updateData(updData: any) {
    let currentData = this.profileDataSubject.getValue();
    this.profileDataSubject.next({ ...currentData, ...updData });
  }

  getData() {
    return this.profileDataSubject.getValue();
  }
}
