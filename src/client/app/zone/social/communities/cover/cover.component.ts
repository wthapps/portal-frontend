import { Component, OnInit } from '@angular/core';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../shared/services/user.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-community-cover',
  templateUrl: 'cover.component.html'
})

export class ZSocialCommunityCoverComponent implements OnInit {

  errorMessage: string = '';
  data: any = [];

  constructor(private apiBaseServiceV2: ApiBaseServiceV2,
              private route: ActivatedRoute,
              private userService: UserService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params);
      this.apiBaseServiceV2.get(`zone/social_network/communities/${params['id']}`).subscribe(
        (res: any)=> {
          this.data = res.data;
          console.log(res.data);
        },
        error => this.errorMessage = <any>error
      );
    });
  }
}
