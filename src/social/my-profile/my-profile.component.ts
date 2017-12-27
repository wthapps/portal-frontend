import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import { ApiBaseService, UserService } from '@wth/shared/services';


@Component({
  selector: 'z-social-my-profile',
  templateUrl: 'my-profile.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['my-profile.component.scss']
})
export class ZSocialMyProfileComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  soUserProfile$: Observable<any>;

  showIntro: boolean = false;

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

    this.route.params.subscribe(params => {
      this.showIntro = (params['intro']);
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
    this.apiBaseService.put(`zone/social_network/users/${this.userService.profile.uuid}`, e.data).subscribe((res: any) => {
      // this.data = res.data;
      this.userService.soUserProfile = res.data;
    });
  }
}
