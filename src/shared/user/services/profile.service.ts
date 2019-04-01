import { Injectable } from '@angular/core';
import { ApiBaseService, UserService } from '@shared/services';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';

@Injectable()
export class ProfileService {

  profile$: Observable<any>;
  myProfile$: Observable<any>;

  private _profile = new Subject<any>();
  private _myProfile = new Subject<any>();

  private url = 'zone/social_networkd/users/';
  private newUrl = 'account/profiles';
  constructor(private apiBaseService: ApiBaseService,
              private userService: UserService,
              private toastService: ToastsService) {
    this.profile$ = this._profile.asObservable();
    this.myProfile$ = this._myProfile.asObservable();
  }

  get(id: string) {
    this.apiBaseService.get(`zone/social_network/users/${id}`).subscribe(response => {
       this._profile.next(Object.assign({}, response.data));
    });
  }

  getProfileNew(id: string) {
    return this.apiBaseService.get(`${this.newUrl}/${id}`).subscribe(response => {
      this.setProfile(response.data.attributes);
    });
  }

  getMyProfile(): Promise<any> {
    return this.apiBaseService.get(`${this.newUrl}/my_profile`).toPromise()
    .then(response => {
      this._myProfile.next(response.data.attributes);
    });
  }

  updateCard(profile: any) {
    return this.apiBaseService.patch(`${this.newUrl}/${profile.uuid}?is_card=true`, profile).subscribe(response => {
      this.setProfile(response.data.attributes);
      this.toastService.success('You updated card successfully!');
    });
  }

  updateProfile(profile: any) {
    this.userService.update(profile).subscribe((response: any) => {
      this._myProfile.next(response.data);
      this.toastService.success('You updated profile successfully!');
    });
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
    this._profile.next(profile);
  }

  getProfile(): Observable<any> {
    return this.profile$;
  }

}
