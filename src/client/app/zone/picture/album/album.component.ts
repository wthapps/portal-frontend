import {Component, Input, OnInit, OnChanges, SimpleChanges, ElementRef, EventEmitter, Output} from '@angular/core';

import {ApiBaseService, LoadingService} from '../../../shared/index';
import {BaseMediaComponent} from "../../shared/media/base-media.component";
import {MediaType} from "../../../shared/config/constants";
import {ToastsService} from "../../../partials/toast/toast-message.service";
import {ConfirmationService} from "primeng/components/common/api";
import {FormManagerService} from "../../../shared/form/form-manager.service";
import {Photo} from "../../../shared/models/photo.model";

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-album',
  templateUrl: 'album.component.html',
})

export class ZAlbumComponent extends BaseMediaComponent {

  @Output() selectedPhotos: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();
  @Output() selectedPhotoFull: EventEmitter<Array<Photo>> = new EventEmitter<Array<Photo>>();

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

  updateDetails(item: any) {

  }
}
