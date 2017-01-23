import { Component, OnInit, OnChanges, Output, Input, EventEmitter } from '@angular/core';

// import {ZPhotoDetailComponent} from './photo-detail.component';
import { Photo } from '../../../shared/models/photo.model';
import { BaseMediaComponent } from '../../shared/index';
import {
  ApiBaseService,
  MediaType,
  LoadingService,
  ToastsService,
  ConfirmationService
} from '../../../shared/index';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'zone-share-with-me',
  templateUrl: 'shared-with-me.component.html',
  styleUrls: ['shared-with-me.component.css']
})

export class ZoneSharedWithMeComponent extends BaseMediaComponent implements OnInit, OnChanges {
  showImg: boolean = false;
  imgId: number;
  sendActionDetail: any;
  items: any;

  @Input() resetSelected: boolean;
  @Input() preview: boolean;
  @Input() inputAction: any;
  @Input() viewInfo: boolean;
  @Input() hasUploadedItem: boolean;

  @Output() selectedPhotos: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();
  @Output() selectedPhotoFull: EventEmitter<Array<Photo>> = new EventEmitter<Array<Photo>>();
  @Output() modalHide: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() modalAction: EventEmitter<string> = new EventEmitter<string>();

  constructor(public apiService: ApiBaseService,
              public toastsService: ToastsService,
              public loadingService: LoadingService,
              public confirmationService: ConfirmationService) {
    super(MediaType.sharedWithMe);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges() {
    if (this.needToReload) {
      this.items = [];
      this.loadItems(this.currentPage);
    }

    // code new
    if (this.inputAction) {
      switch (this.inputAction) {
        case 'preview':
          this.sendActionToPhotoDetail(this.inputAction);
          break;
        case 'info':
          this.sendActionToPhotoDetail(this.inputAction);
          break;
        case 'favourite':
          console.log('favourite', this.inputAction);
          break;
        default:
          break;
      }
    }
    // end code new
  }

  /**
   * ========================
   * Action from Picture
   * (preview, info)
   */
  sendActionToPhotoDetail(event: string) {
    this.sendActionDetail = event;
  }

  /**
   *
   * End Action from Picture
   */

  /**
   * ========================
   * Action from grid view
   */
  onImgsSelected(event: any) {
    let _this_photos = this;
    this.selectedItems = [];
    _.map(event, (v: any)=> {
      _this_photos.selectedItems.push(_.find(_this_photos.items, ['id', v]));
    });
    this.selectedPhotos.emit(event);
    this.selectedPhotoFull.emit(this.selectedItems);
  }

  onLoadMore(p: number) {
    this.currentPage = p;
    this.loadItems(p + 1);
  }

  onPreview(preview: string): void {
    this.sendActionToPhotoDetail(preview);
  }

  onGridEvent(event: any) {
    switch (event.action) {
      case 'favourite':
        this.addFavourite_favourite(true, event.item);
        break;
      default:
        break;
    }
  }

  /**
   *
   * End Action from grid view
   */


  /**
   * ========================
   * Action from photo detail
   */
  onAction(event: any) {
    switch (event.action) {
      case 'share':
        // this.delete(event.id);
        break;
      case 'favourite':
        // this.delete(event.id);
        break;
      case 'tag':
        this.toggleModal(event, event.action);
        // this.delete(event.id);
        break;
      case 'delete':
        this.delete(event.id);
        break;
      case 'info':
        this.sendActionToPhotoDetail(event);
        break;
      default:
        break;
    }
  }

  onHideModalClicked(event: boolean): void {
    if (event) {

      // hide modal show image
      this.clearBaseMediaAction();
      this.showImg = false;
      this.preview = false;
      this.inputAction = null;
      this.sendActionDetail = null;
      // end hide modal show image

      this.modalHide.emit(false);
    }
  }

  /**
   *
   * End Action from photo detail
   */


  private addFavourite_favourite(event: any, item: any = null) {

    this.loadingService.start();

    let newFavourite = this.selectedItems;
    if (item) {
      newFavourite = [item];
    }

    let hasFavourite = _.find(newFavourite, {'favorite': false});

    let setFavourite = false; // if current item's favorite is true

    if (hasFavourite) { // if there is one item's favorite is false
      setFavourite = true;
    }
    let body = JSON.stringify({
      ids: _.map(newFavourite, 'id'),
      setFavourite: setFavourite
    });


    this.apiService.post(`zone/photos/favourite`, body)
      .subscribe((result: any) => {
          _.map(newFavourite, (v: any)=> {
            this.items.photos = _.reject(this.items.photos, ['id', v.id]);
          });


          this.loadingService.stop();
          this.toastsService.success(result.message);

        },
        error => {
          // stop loading
          this.loadingService.stop();
          this.toastsService.danger(error);
          console.log(error);
        }
      );
  }
}
