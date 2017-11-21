import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';

import { ApiBaseService } from '../../core/shared/services/apibase.service';
import { UserService } from '../../core/shared/services/user.service';
import { UserInfo } from '../../core/shared/models/user/user-info.model';
import { CommonEventService } from '../../core/shared/services/common-event/common-event.service';
import { LoadingService } from '../../core/shared/components/loading/loading.service';
import { ToastsService } from '../../core/shared/components/toast/toast-message.service';


declare let $: any;

@Component({
  moduleId: module.id,
  selector: 'z-chat-my-profile',
  templateUrl: 'my-profile.component.html',
  styleUrls: ['my-profile.component.css']
})
export class ZContactMyProfileComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  data: any = new UserInfo();
  soUserProfile: Observable<any> ;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private commonEventService: CommonEventService,
              private toastsService: ToastsService,
              private loadingService: LoadingService,
              private apiBaseService: ApiBaseService) {
    this.soUserProfile = this.userService.soProfile$;
  }

  ngOnInit() {
    this.apiBaseService.get(`zone/social_network/users/${this.userService.profile.uuid}`).subscribe((res: any) => {
      // this.data = res.data;
      this.userService.soUserProfile = res.data;
    });
  }

  doEvent(e: any) {
    this.apiBaseService.put(`zone/social_network/users/${this.userService.profile.uuid}`, this.data).subscribe((res: any) => {
      this.data = res.data;
    });
  }

}
