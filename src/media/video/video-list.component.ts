import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  OnDestroy
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

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'me-video-list',
  templateUrl: 'video-list.component.html'
})
export class ZMediaVideoListComponent {}
