import { Component, OnInit } from '@angular/core';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../../../partials/loading/loading.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-community-cover',
  templateUrl: 'cover.component.html'
})

export class ZSocialCommunityCoverComponent implements OnInit {

  errorMessage: string = '';
  data: any = [];
  uuid: string = '';


  constructor(private apiBaseServiceV2: ApiBaseServiceV2,
              private loadingService: LoadingService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    // this.loadingService.start('.zone-social-cover');
    this.route.params.subscribe(params => {

      this.uuid = params['id'];
      this.apiBaseServiceV2.get(`zone/social_network/communities/${params['id']}`).subscribe(
        (res: any)=> {
          this.data = res.data;
          // this.loadingService.stop('.zone-social-cover');
        },
        error => this.errorMessage = <any>error
      );
    });
  }
}
