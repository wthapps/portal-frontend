import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../../services/apibase.service';
import { UserService } from '../../../services/user.service';
import { Communication } from '@shared/shared/helpers/communication/communication';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()
export class ProfileService extends Communication {

  profile$: Observable<any>;
  private _profile: Subject<any> = new Subject<any>();
  private url = 'zone/social_networkd/users/';
  constructor(private apiBaseService: ApiBaseService,
              private userService: UserService) {
    super();
    this.profile$ = this._profile.asObservable();
  }

  get(id: string) {
    this.apiBaseService.get(`zone/social_network/users/${id}`).subscribe(response => {
       this._profile.next(Object.assign({}, response.data));
    });
  }

  getMyProfile() {
    return this.apiBaseService.get(`zone/social_network/users/${this.userService.getSyncProfile().uuid}`);
  }

  updateMyProfile(body: any) {
    return this.apiBaseService.put(`zone/social_network/users/${this.userService.getSyncProfile().uuid}`, body);
  }

  onLoad(url: string) {
    if (url) {
      return this.apiBaseService.get(url);
    }
    return null;
  }

  setProfile(profile: any) {
    this._profile.next(Object.assign({}, profile));
  }

}
