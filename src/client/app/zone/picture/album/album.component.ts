import {Component, Input, OnInit, OnChanges, SimpleChanges, ElementRef} from '@angular/core';

import {ZPictureBarComponent} from '../shared/bar-control.component';
import {ZAlbumGridComponent} from '../shared/grid-album.component';
import {Album} from '../../../shared/models/album.model';
import {ApiBaseService, LoadingService} from '../../../shared/index';
import {ZAlbumListComponent} from '../shared/list-album.component';
import {BaseMediaComponent} from "../../shared/media/base-media.component";
import {MediaType} from "../../../shared/config/constants";
import {FormTextElement} from "../../../shared/models/form/form-text-element.model";
import {ToastsService} from "../../../partials/toast/toast-message.service";
import {ConfirmationService} from "primeng/components/common/api";

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-album',
  templateUrl: 'album.component.html',
})

export class ZAlbumComponent extends BaseMediaComponent {

  @Input() pageView: string = 'grid';

  constructor(private apiService: ApiBaseService,
              private toastsService: ToastsService,
              private loadingService: LoadingService,
              private confirmationService: ConfirmationService) {
    super(MediaType.album, this.apiService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit() {
    // let win = $(window);
    // let _this = this;
    //
    // // Each time the user scrolls
    // win.scroll(function () {
    //   // End of the document reached?
    //   if ($(document).height() - win.height() == win.scrollTop()) {
    //     _this.currentPage = _this.currentPage + 1;
    //     _this.getAlbum(_this.currentPage);
    //   }
    // });
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes['pageView'].currentValue) {
    //   var view = changes['pageView'].currentValue;
    //   if (view == 'grid') {
    //     this.isGridView = true;
    //     this.isListView = false;
    //   } else if  (view == 'list') {
    //     this.isGridView = false;
    //     this.isListView = true;
    //   }
    // }
  }

  onPageView(view: string) {
    // this.pageView = view;
  }

  onAlbumDetail() {

  }
}
