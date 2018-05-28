import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as appStore from '../shared/store';
import {
  GetAll,
  Favorite,
  AddSuccess,
  DeleteMany,
  Download
} from '../shared/store/media/media.actions';
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import { Constants } from '@wth/shared/constant';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { MediaActionHandler } from '@media/shared/media';
import { ApiBaseService } from '@shared/services';
import { BsModalComponent } from 'ng2-bs3-modal';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'me-video-list',
  templateUrl: 'video-list.component.html'
})
export class ZMediaVideoListComponent implements OnInit{
  videos: any;
  selectedObject: any;
  @ViewChild('modal') modal: BsModalComponent;

  constructor(private apiBaseService: ApiBaseService) {}

  ngOnInit() {
    this.load();
  }

  doEvent(e: any) {
    switch(e.action) {
      case 'uploaded':
        this.load();
      break;
      case 'viewDetails':
        this.modal.open();
        this.selectedObject = e.payload.selectedObject;
      break;
    }
  }

  load() {
    this.apiBaseService.get(`media/videos`).subscribe(res => {
      this.videos = res.data;
    });
  }
}
