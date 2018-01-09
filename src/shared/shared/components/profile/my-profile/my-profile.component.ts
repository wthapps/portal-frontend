import { Component, ViewChild, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';

import { UserService } from '@shared/services/user.service';
import { ApiBaseService } from '@shared/services/apibase.service';


@Component({
  selector: 'z-my-profile',
  templateUrl: 'my-profile.component.html',
  styleUrls: ['my-profile.component.scss']
})
export class ZMyProfileComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  profile$: Observable<any>;
  // data: any;

  constructor(private userService: UserService,
              private apiBaseService: ApiBaseService) {
    this.profile$ = this.userService.profile$;
  }

  ngOnInit() {
    this.apiBaseService.get(`zone/social_network/users/${this.userService.profile.uuid}`).toPromise().then((res: any) => {
      this.userService.setProfileByKey('so_user', res.data);
    });
  }

  onOpen(user: any) {
    this.modal.open();
  }

  onClose() {
    setTimeout(()=> {
      console.log('adaafafaf');
    }, 500);
  }

  doEvent(e: any) {
    this.apiBaseService.put(`zone/social_network/users/${this.userService.profile.uuid}`, e).subscribe((res: any) => {
      this.userService.setProfileByKey('so_user', res.data);
    });
  }
}
