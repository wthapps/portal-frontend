import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/toPromise';
import { ApiBaseService, CommonEventService } from '@shared/services';


@Component({
  moduleId: module.id,
  selector: 'z-media-sharing-detail',
  templateUrl: 'sharing-detail.component.html'
})
export class ZMediaSharingDetailComponent implements OnInit, OnDestroy {
  object: any;
  params: any;
  showDetail: boolean;
  sub: any;

  constructor(
    private apiBaseService: ApiBaseService,
    private commonEventService: CommonEventService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.commonEventService.filter((e: any) => {return e.channel == 'media:photo:update_recipients'}).subscribe((e: any) => {
      this.params.recipients = e.payload;
    })
    this.route.params.subscribe((params: any) => {
        this.apiBaseService.get(`media/sharings/${params.id}`).subscribe((res: any) => {
          this.params = res;
        });
      }
    )
  }

  ngOnDestroy() {
    if(this.sub) this.sub.unsubscribe();
  }
}
