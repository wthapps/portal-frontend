import { Component, ViewChild, OnChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BaseMediaComponent } from '../shared/media/base-media.component';
import { ZonePhotoComponent } from './photo/photo.component';
import { ZoneVideoComponent } from './video/video.component';
import { ZoneFavouritesComponent } from './favourites/index';
import { MediaType } from '../../shared/config/constants';
import {
  ApiBaseService,
  ToastsService,
  LoadingService,
  ConfirmationService

} from '../../shared/index';
import { ZAlbumComponent } from "./album/album.component";
import { ZAlbumDetailComponent } from "./album/album-detail.component";
import { ZoneUploadingComponent } from '../shared/index';


declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-picture',
  templateUrl: 'picture.component.html',
  styleUrls: ['picture.component.css']
})

export class ZPictureComponent implements OnChanges {

  @ViewChild('media') baseMedia: BaseMediaComponent;
  @ViewChild('zoneUpload') zoneUpload: ZoneUploadingComponent;// = new ZoneUploadingComponent(this.apiService);

  image_src: string = '';
  step: number = 0;
  pageView: string = 'grid';
  sub: any;
  category: string;
  viewPicture: any;
  viewPictureType: any;

  showAddedtoAlbumToast: boolean = false;
  photoCount: number;
  showAddtoAlbumForm: boolean = false;
  photos: Array<number>;
  onePhotoEdit: any;
  showCreateAlbumForm: boolean = false;
  album: any;
  resetSelected: boolean = false;

  hasFavourite: boolean = false;
  isLoading: boolean = false;
  paramId: number;

  /**
   * Modal
   */
  modalShare: boolean = false;
  modalTag: boolean = false;
  modalPreview: boolean = false;
  modalEdit: boolean = false;
  modalViewInfo: boolean = false;


  /**
   * Items is array of Photos, Album, Video, etc.
   */
  items: Array<any>;
  selectedItems: Array<any>;
  hasSelectedItem: boolean;
  hasMultiSelectedItem: boolean;
  hasUploadedItem: boolean;
  // deletedItems: Array<any>;
  mediaType: any;

  constructor(// private element: ElementRef,
    //           private photoService: PhotoService,
    //           private albumService: AlbumService,
    private route: ActivatedRoute,
    private apiService: ApiBaseService,
    private toastsService: ToastsService,
    private loadingService: LoadingService,
    private confirmationService: ConfirmationService
    //           private dialogService: DialogService,
    //           private loadingService: LoadingService,
    //           private toastsService: ToastsService

  ) {

  }

  ngOnInit() {
    this.hasUploadedItem = false;
    this.selectedItems = new Array<any>();
    this.photos = new Array<number>();
    this.mediaType = MediaType;

    this.sub = this.route.params.subscribe(params => {
      this.category = params['category'];
      if (params['id']) {
        this.category += 'Detail';
      }
      this.collectView(params);
    });
  }

  ngOnChanges(changes: any) {

  }


  collectView(params: any) {
    switch (this.category) {
      case MediaType.photo:
        this.baseMedia = new ZonePhotoComponent(this.apiService, this.toastsService, this.loadingService, this.confirmationService);
        break;
      case MediaType.video:
        this.baseMedia = new ZoneVideoComponent(this.apiService);
        break;
      case MediaType.album:
        this.baseMedia = new ZAlbumComponent();
        break;
      case MediaType.albumDetail:
        this.baseMedia = new ZAlbumDetailComponent();
        break;
      case MediaType.favourites:
        this.baseMedia = new ZoneFavouritesComponent(this.apiService, this.toastsService, this.loadingService, this.confirmationService);
        break;
    }
    // debugger;
  }

  ngAfterViewInit() {
    // only allow drag from outside the browser
    $('body').on('dragstart', function (event: any) {
      event.preventDefault();
    });
  }

  hideAddedtoAlbumToast(event: boolean) {
    this.showAddedtoAlbumToast = event;
  }

  showModalAddToAlbumEvent(event: boolean) {
    this.showAddtoAlbumForm = true;
  }

  resetSelectedAction() {
    if (this.resetSelected) {
      this.resetSelected = false;
    } else {
      this.resetSelected = true;
    }
  }

  photoEvent(photos: Array<number>) {
    this.photos = photos;
  }

  /**
   *
   * @param event
   */
  preview(event: any) {
    if (event) {
      this.modalPreview = true;
    }
  }

  share(event: any) {
    if (event) {
      this.modalShare = true;
    }
  }

  /**
   * Hide modal
   */
  onModalHide(event: boolean): void {

    console.log('data', event);
    this.modalShare = event;
    this.modalTag = event;
    this.modalPreview = event;
    this.modalEdit = event;
    this.modalViewInfo = event;
  }

  /**
   * This is action from Photo component
   */
  onModalAction(event: string): void {
    if (event == 'tag') {
      this.modalTag = true;
    } else if (event == 'share') {
      this.modalShare = true;
    }
  }

  download(event: any) {
    // if (event) {
    //   let body = JSON.stringify({ids: this.selectedItems});
    //   this.loadingService.start();
    //   this.apiBaseService.post(`zone/photos/download`, body)
    //     .subscribe((result: any) => {
    //         // stop loading
    //         this.loadingService.stop();
    //         //this.toastsService.success(result.message);
    //       },
    //       error => {
    //         // stop loading
    //         this.loadingService.stop();
    //         //this.toastsService.danger(error);
    //         console.log(error);
    //       }
    //     );
    // }
  }

  add(event: any) {
    this.showAddtoAlbumForm = true;
    // if (event) {
    // let body = JSON.stringify({ids: this.selectedItems});
    // this.loadingService.start();
    // this.apiBaseService.post(`zone/photos/download`, body)
    //   .subscribe((result: any) => {
    //       // stop loading
    //       this.loadingService.stop();
    //       //this.toastsService.success(result.message);
    //     },
    //     error => {
    //       // stop loading
    //       this.loadingService.stop();
    //       //this.toastsService.danger(error);
    //       console.log(error);
    //     }
    //   );
    // }
  }

  edit(event: any) {
    this.modalEdit = true;
  }

  viewInfo(event: any) {
    this.modalViewInfo = true;
  }

  changedSelectedItems(items: Array<any>) {
    this.selectedItems = items;
    this.hasSelectedItem = (items.length > 0) ? true : false;
    if (this.category == 'photo') {
      this.photos = this.selectedItems;
    }
    this.hasMultiSelectedItem = (items.length > 1) ? true : false;
  }

  changedSelectedItemsFull(items: Array<any>): void {
    if (_.find(items, {'favorite': false})) {
      this.hasFavourite = false;
    } else {
      this.hasFavourite = true;
    }
    this.onePhotoEdit = items[0];
  }

  viewChanged(view: string) {
    // this.baseMedia.changeView(view);
    this.pageView = view;
  }

  uploadedItem(hasItem: boolean) {
    this.baseMedia.needToReload = hasItem;
    this.baseMedia.loadItems(this.baseMedia.currentPage);
  }

}
