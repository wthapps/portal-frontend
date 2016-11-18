import { Component, ViewChild, OnInit } from '@angular/core';
import { PostNewComponent } from '../post/index';
import { BaseZoneSocialHomePage } from "../base/base-social-home-page";

import { ApiBaseService } from '../../../shared/services/apibase.service';
import { SocialService } from '../services/social.service';
import { ActivatedRoute } from '@angular/router';

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
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
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
