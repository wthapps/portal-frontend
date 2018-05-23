import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ApiBaseService,
  CommonEventService,
  PhotoService,
  UserService
} from '@wth/shared/services';

@Component({
  selector: 'video-detail',
  templateUrl: 'video-detail.component.html',
  styleUrls: ['video-detail.component.scss']
})
export class ZVideoDetailComponent {}
