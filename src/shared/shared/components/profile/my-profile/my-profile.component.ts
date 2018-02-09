import { Component, ViewChild, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BsModalComponent } from 'ng2-bs3-modal';

import { UserService } from '@shared/services/user.service';
import { ApiBaseService } from '@shared/services/apibase.service';


@Component({
  selector: 'z-my-profile',
  templateUrl: 'my-profile.component.html',
  styleUrls: ['my-profile.component.scss']
})
export class ZMyProfileComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  profile$: Observable<any>;
  data: any;

  constructor(private userService: UserService,
              private apiBaseService: ApiBaseService) {
    this.profile$ = this.userService.getAsyncProfile();
  }

  ngOnInit() {
    this.apiBaseService.get(`zone/social_network/users/${this.userService.getSyncProfile().uuid}`).toPromise().then((res: any) => {
      this.data = res.data;
    });
  }

  onOpen(user: any) {
    this.modal.open();
  }

  updateUser(e: any) {
    this.userService.update(e.data).subscribe((res: any) => {

    })
  }

  doEvent(e: any) {
    this.apiBaseService.put(`zone/social_network/users/${this.userService.getSyncProfile().uuid}`, e).subscribe((res: any) => {
      this.data = res.data;
    });
  }
}
