import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { LoadingService } from '../../../../partials/loading/loading.service';

@Component({
  moduleId: module.id,
  selector: 'z-social-community-detail-notification',
  templateUrl: 'notification.component.html'
})

export class ZSocialCommunityDetailNotificationComponent implements OnInit {

  errorMessage: string = '';
  data: any = [];
  uuid: string = '';


  constructor(private apiBaseServiceV2: ApiBaseServiceV2,
              private loadingService: LoadingService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.uuid = params['id'];
      this.getItem(params['id']);
    });
  }

  getItem(id: string) {
    this.apiBaseServiceV2.get(`zone/social_network/communities/${id}`).subscribe(
      (res: any)=> {
        this.data = res.data;
      },
      error => this.errorMessage = <any>error;
  )
    ;
  }
}
