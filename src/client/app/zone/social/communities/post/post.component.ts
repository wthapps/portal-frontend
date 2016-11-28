import { Component, OnInit } from '@angular/core';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { UserService } from '../../../../shared/services/user.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-community-detail-post',
  templateUrl: 'post.component.html'
})

export class ZSocialCommunityDetailPostComponent implements OnInit {

  errorMessage: string = '';

  constructor(private apiBaseServiceV2: ApiBaseServiceV2,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params);
      /*this.apiBaseServiceV2.get(`/zone/social_network/communities/${params['id']}`).subscribe(
       (res: any)=> {
       console.log(res.data);
       },
       error => this.errorMessage = <any>error
       );*/
    });



    /*this.apiBaseServiceV2.get(`zone/social_network/communities/${this.uuid}`).subscribe(
      (res: any)=> {
        console.log(res.data);
      },
      error => this.errorMessage = <any>error
    );*/
  }
}
