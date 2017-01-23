import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApiBaseService } from '../../../../shared/services/apibase.service';
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


  constructor(private apiBaseService: ApiBaseService,
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
    this.apiBaseService.get(`zone/social_network/communities/${id}`)
      .subscribe((res: any) => {
          this.data = res.data;
        },
        (error: any) => {
          console.log('error', error);
        });
  }
}
