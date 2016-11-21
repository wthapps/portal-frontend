import { Component, ViewChild, OnInit } from '@angular/core';
import { PostNewComponent } from '../post/index';
import { BaseZoneSocialHomePage } from "../base/base-social-home-page";

import { ApiBaseService } from '../../../shared/services/apibase.service';
import { SocialService } from '../services/social.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-profile',
  templateUrl: 'profile.component.html'
})

export class ZSocialProfileComponent extends BaseZoneSocialHomePage implements OnInit {
  @ViewChild('postNew') postNew: PostNewComponent;

  userInfo: any = null;
  errorMessage: string = '';

  constructor(private socialService: SocialService,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {

      if (!params['id']) {
        this.router.navigate(['/zone/social/profile', this.userService.profile.uuid]);
      }

      this.socialService.user.get(params['id']).subscribe((res: any) => {
          this.userInfo = res.data;
        },
        error => {
          this.errorMessage = <any>error;
        }
      );
    });
  }
}
