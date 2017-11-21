import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';

import { ApiBaseService } from '../../core/shared/services/apibase.service';
import { UserService } from '../../core/shared/services/user.service';

@Component({
  moduleId: module.id,
  selector: 'z-chat-my-profile',
  templateUrl: 'my-profile.component.html',
  styleUrls: ['my-profile.component.css']
})
export class ZChatMyProfileComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  soUserProfile$: Observable<any>;
  // data: any;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private apiBaseService: ApiBaseService) {
    this.soUserProfile$ = this.userService.soProfile$;
  }

  ngOnInit() {
    this.apiBaseService.get(`zone/social_network/users/${this.userService.profile.uuid}`).subscribe((res: any) => {
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
    console.debug('chat my-profile: doEvent - e: ', e);
    this.apiBaseService.put(`zone/social_network/users/${this.userService.profile.uuid}`, e).subscribe((res: any) => {
      // this.data = res.data;
      this.userService.soUserProfile = res.data;
    });
  }
}
