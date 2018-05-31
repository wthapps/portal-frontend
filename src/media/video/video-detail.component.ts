import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ApiBaseService,
  CommonEventService,
  PhotoService,
  UserService
} from '@wth/shared/services';
import { Location } from '@angular/common';

@Component({
  selector: 'video-detail',
  templateUrl: 'video-detail.component.html',
  styleUrls: ['video-detail.component.scss']
})
export class ZVideoDetailComponent implements OnInit {
  video: any;

  constructor(private apiBaseService: ApiBaseService, private route: ActivatedRoute, private location: Location){}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.apiBaseService.get(`media/videos/${params.id}`).subscribe(res => {
        this.video = res.data;
      })
    })
  }

  back() {
    this.location.back();
  }
}
