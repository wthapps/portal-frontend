import {Component, Input, OnInit, OnChanges, SimpleChanges, ElementRef} from '@angular/core';

import {ZPictureBarComponent} from '../shared/bar-control.component';
import {ZAlbumGridComponent} from '../shared/grid-album.component';
import {Album} from '../../../shared/models/album.model';
import {ApiBaseService, LoadingService} from '../../../shared/index';
import {ZAlbumListComponent} from '../shared/list-album.component';
import {BaseMediaComponent} from "../../shared/media/base-media.component";
import {MediaType} from "../../../shared/config/constants";
import {ToastsService} from "../../../partials/toast/toast-message.service";
import {ConfirmationService} from "primeng/components/common/api";
import {FormManagerService} from "../../../shared/form/form-manager.service";

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-album',
  templateUrl: 'album.component.html',
})

export class ZAlbumComponent extends BaseMediaComponent {

  @Input() pageView: string = 'grid';

  constructor(private apiService?: ApiBaseService,
              private toastsService?: ToastsService,
              private loadingService?: LoadingService,
              private confirmationService?: ConfirmationService,
              private formManagerService?: FormManagerService,
  ) {
    super(MediaType.album, this.apiService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  onPageView(view: string) {
    // this.pageView = view;
  }

  onAlbumDetail() {

  }
}
