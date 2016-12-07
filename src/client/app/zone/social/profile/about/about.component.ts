import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { Router, ActivatedRoute } from '@angular/router';
import { SocialService } from '../../services/social.service';

@Component({
  moduleId: module.id,
  selector: 'z-social-profile-about',
  templateUrl: 'about.component.html'
})

export class ZSocialProfileAboutComponent implements OnInit {

  constructor(private socialService: SocialService,
              private route: ActivatedRoute,
              private router: Router,
              private apiBaseService: ApiBaseServiceV2,
              private userService: UserService) {
    console.log('ZSocialProfileAboutComponent');
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params);
    });
  }
}
