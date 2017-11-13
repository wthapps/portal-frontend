import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/toPromise';
import { ApiBaseService } from '../../core/shared/services/apibase.service';


@Component({
  moduleId: module.id,
  selector: 'z-media-sharing-detail',
  templateUrl: 'sharing-detail.component.html'
})
export class ZMediaSharingDetailComponent implements OnInit {
  object: any;
  params: any;
  showDetail: boolean;

  constructor(
    private apiBaseService: ApiBaseService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
        this.apiBaseService.get(`media/sharings/${params.id}`).subscribe((res: any) => {
          this.params = res.sharing;
        });
      }
    )
  }
}
