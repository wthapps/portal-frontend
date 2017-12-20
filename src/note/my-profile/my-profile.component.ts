import { Component, ViewChild, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';

import { UserService } from '@shared/services/user.service';
import { ApiBaseService } from '@shared/services/apibase.service';


@Component({
  selector: 'z-note-my-profile',
  templateUrl: 'my-profile.component.html',
  styleUrls: ['my-profile.component.scss']
})
export class ZNoteMyProfileComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  soUserProfile$: Observable<any>;
  // data: any;

  constructor(private userService: UserService,
              private apiBaseService: ApiBaseService) {
    this.soUserProfile$ = this.userService.soProfile$;
  }

  ngOnInit() {
    this.apiBaseService.get(`zone/social_network/users/${this.userService.profile.uuid}`).toPromise().then((res: any) => {
      // this.data = res.data;
      this.userService.soUserProfile = res.data;
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
    this.apiBaseService.put(`zone/social_network/users/${this.userService.profile.uuid}`, e.data).subscribe((res: any) => {
      // this.data = res.data;
      this.userService.soUserProfile = res.data;
    });
  }
}
