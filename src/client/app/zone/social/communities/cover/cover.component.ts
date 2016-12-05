import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../../../partials/loading/loading.service';
import { ZSocialCommunityFormPreferenceComponent } from '../form/preferences.component';
import { ZoneReportService } from '../../../shared/form/report/report.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-community-cover',
  templateUrl: 'cover.component.html'
})

export class ZSocialCommunityCoverComponent implements OnInit, OnChanges {

  @ViewChild('modalPreference') modalPreference: ZSocialCommunityFormPreferenceComponent;
  @Input() data: any;

  errorMessage: string = '';
  item: any = [];
  uuid: string = '';


  constructor(private apiBaseServiceV2: ApiBaseServiceV2,
              private loadingService: LoadingService,
              private zoneReportService: ZoneReportService,
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

  onPreference(item: any) {
    this.modalPreference.modal.open();
    this.item = item;
    return false;
  }

  onUpdated(item: any) {
    if (item) {
      this.item = item;
    }
  }

  onReport() {
    this.zoneReportService.community(this.uuid);
    return false;
  }
}
