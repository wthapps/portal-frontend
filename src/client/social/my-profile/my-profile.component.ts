import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

import { UserService } from '../../core/shared/services/user.service';
import { ApiBaseService } from '../../core/shared/services/apibase.service';

@Component({
  moduleId: module.id,
  selector: 'z-social-my-profile',
  templateUrl: 'my-profile.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['my-profile.component.css']
})
export class ZSocialMyProfileComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  soUserProfile$: Observable<any>;

  // data: any;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private apiBaseService: ApiBaseService) {
    this.soUserProfile$ = this.userService.soProfile$;
  }

  ngOnInit() {
    this.apiBaseService.get(`zone/social_network/users/${this.userService.profile.uuid}`).take(1).subscribe((res: any) => {
      // this.data = res.data;
      this.userService.soUserProfile = res.data;
    });
  }

  onOpen(user: any) {
    this.modal.open();
  }

  onClose() {
    setTimeout(() => {
      console.log('adaafafaf');
    }, 500);
  }

  doEvent(e: any) {
    this.apiBaseService.put(`zone/social_network/users/${this.userService.profile.uuid}`, e).subscribe((res: any) => {
      // this.data = res.data;
      this.userService.soUserProfile = res.data;
    });
  }
}
