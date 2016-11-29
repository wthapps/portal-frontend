import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../../../partials/loading/loading.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-community-cover',
  templateUrl: 'cover.component.html'
})

export class ZSocialCommunityCoverComponent implements OnInit, OnChanges {

  @Input() data: any;

  errorMessage: string = '';
  item: any = [];
  uuid: string = '';


  constructor(private apiBaseServiceV2: ApiBaseServiceV2,
              private loadingService: LoadingService,
              private route: ActivatedRoute) {
  }

  ngOnChanges() {
    if (this.data) {
      this.item = this.data;
    }
  }

  ngOnInit() {
    // this.loadingService.start('.zone-social-cover');
    this.route.params.subscribe(params => {
      this.uuid = params['id'];
    });
  }
}
