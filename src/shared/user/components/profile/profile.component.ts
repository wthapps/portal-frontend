import { Component, ViewChild, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BsModalComponent } from 'ng2-bs3-modal';

import { UserService } from '@shared/services/user.service';
import { ApiBaseService } from '@shared/services/apibase.service';
import { WModalService } from '@shared/modal';
import { NameEditModalComponent } from '@shared/user/components/cover-info/name-edit-modal.component';


@Component ({
  selector: 'w-user-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile$: Observable<any>;
  data: any;

  constructor(private userService: UserService,
              private apiBaseService: ApiBaseService,
              private modalService: WModalService) {
    this.profile$ = this.userService.getAsyncProfile();

    this.modalService.submit$.subscribe(payload => {
      this.updateProfile(payload);
    });
  }

  ngOnInit() {
    this.apiBaseService.get(`zone/social_network/users/${this.userService.getSyncProfile().uuid}`).toPromise().then((res: any) => {
      this.data = res.data;
    });
  }

  updateProfile(profile: any) {
    console.log('you are updating profile', profile);
    this.userService.update(profile).subscribe((res: any) => {

    });

  }

  openModal(payload: any) {
    switch (payload.modalName) {
      case 'NameEditModal':
        this.modalService.open(NameEditModalComponent, {user: payload.user});
        break;
    }
  }


  updateUser(e: any) {
    this.userService.update(e.data).subscribe((res: any) => {

    });
  }

  doEvent(e: any) {
    this.apiBaseService.put(`zone/social_network/users/${this.userService.getSyncProfile().uuid}`, e).subscribe((res: any) => {
      this.data = res.data;
    });
  }
}
