import { Component, OnInit, Output, Input, EventEmitter, SimpleChanges, OnChanges ViewChild } from '@angular/core';
import { ZPictureGridComponent, ZPictureListComponent } from '../../shared/index';

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
import { FormManagerService } from '../../../shared/form/form-manager.service';
import { ZonePhotoDetailComponent } from './photo-detail.component';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'zone-photo',
  templateUrl: 'photo.component.html'
})

export class ZonePhotoComponent extends BaseMediaComponent implements OnInit {

  @ViewChild('zonephotodetail') zonephotodetail: ZonePhotoDetailComponent;
  showImg: boolean = false;
  imgId: number;
  sendActionDetail: any;

  @Input() resetSelected: boolean;
  @Input() preview: boolean;
  @Input() inputAction: any;
  @Input() viewInfo: boolean;
  @Input() hasUploadedItem: boolean;

  @Output() selectedPhotos: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();
  @Output() selectedPhotoFull: EventEmitter<Array<Photo>> = new EventEmitter<Array<Photo>>();
  @Output() modalHide: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() modalAction: EventEmitter<string> = new EventEmitter<string>();

  constructor(private apiService: ApiBaseService,
              private toastsService: ToastsService,
              private loadingService: LoadingService,
              private confirmationService: ConfirmationService,
              private formManagerService?: FormManagerService,) {
    super(MediaType.photo, this.apiService);
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
        case "preview":
          this.sendActionToPhotoDetail(this.inputAction);
          break;
        case "info":
          this.sendActionToPhotoDetail(this.inputAction);
          break;
        case "favourite":
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

  onLoadMore(p: number) {
    this.currentPage = p;
    this.loadItems(p + 1);
  }

  onPreview(preview: string): void {
    this.sendActionToPhotoDetail(preview);
  }

  onGridEvent(event: any) {
    switch (event.action) {
      case "favourite":
        this.addFavourite_photo(true, event.item);
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
      case "favourite":
        //console.log('favourite', event);
        this.addFavourite(true, event.currentItem);
        // this.delete(event.id);
        break;
      case "share":
      case "tag":
        this.selectedItems = [event.currentItem];
        this.toggleModal(event, event.action);
        break;
      case "delete":
        this.delete(event.currentItem.id);
        break;
      case "info":
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

  updateDetails(item: any) {
    if (this.sendActionDetail != null) {
      this.zonephotodetail.myItem = item;
    }
    console.log('update item', item);
  }

  /**
   *
   * End Action from photo detail
   */


  private addFavourite_photo(event: any, item: any = null) {

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
      .map(res => res.json())
      .subscribe((result: any) => {
          // stop loading
          _.map(newFavourite, (v)=> {
            let vitem = _.find(this.items, ['id', v.id]);
            vitem.favorite = setFavourite;
          });
          // this.items =

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
