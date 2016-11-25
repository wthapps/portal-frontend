import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiBaseServiceV2 } from '../../../shared/services/apibase.service.v2';
import { UserService } from '../../../shared/services/user.service';

@Component({
  moduleId: module.id,
  selector: 'z-social-community-detail',
  templateUrl: 'communities-detail.component.html'
})

export class ZSocialCommunityDetailComponent implements OnInit{
  errorMessage: string = '';

  constructor(private apiBaseServiceV2: ApiBaseServiceV2,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) {
  }

  ngOnInit() {
    console.log(this);
    this.route.params.subscribe(params => {
      console.log(params);
      /*this.apiBaseServiceV2.get(`/zone/social_network/communities/${params['id']}`).subscribe(
       (res: any)=> {
       console.log(res.data);
       },
       error => this.errorMessage = <any>error
       );*/
    });


  }
}
