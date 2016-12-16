import { Component, OnInit, OnChanges, OnDestroy, EventEmitter } from '@angular/core';
import {
  MediaType,
  ApiBaseService,
  LoadingService,
  ToastsService,
  ConfirmationService
} from '../../../shared/index';
import { Album } from '../../../shared/models/album.model';
import { AlbumPhoto } from '../../../shared/models/album-photos.model';
import { ZPictureFormAddToAlbumComponent } from '../form/form-add-to-album.component';
import { ZPictureFormCreateAlbumComponent } from '../form/form-create-album.component';
import { ZAddedToAlbumToastComponent } from '../toast/added-to-album-toast.component';
import { ZCreatedAlbumToastComponent } from '../toast/created-album-toast.component';


declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'base-media',
  template: `<zone-photo *ngIf='category=="photo"'></zone-photo>
  <div *ngIf='category=="album"'> album </div>
  <div *ngIf='category=="playlist"'> playlist</div>
  
`
})

export class BaseMediaComponent implements OnInit, OnChanges, OnDestroy {

  // @Input()
  getAction: any;


  // code new
  sendBaseMediaAction: any;
  // end code new

  category: string;
  selectedItems: Array<any> = new Array<any>();
  addItems: Array<any> = new Array<any>();
  previewItems: Array<any> = new Array<any>();
  items: any = [];
  currentPage: number = 1;
  perPage: number = 1;
  total: number = 1;
  isGridView: boolean;
  isListView: boolean;
  pageView: string = 'grid';
  hasSelectedItem: boolean = false;
  needToReload: boolean = false;

  errorMessage: string;
  showCreatedAlbumToast: boolean;
  album: Album;
  albumPhotos: AlbumPhoto;
  selectedPhotos: EventEmitter<any>;
  selectedPhotoFull: EventEmitter<any>;
  formAddToAlbum: ZPictureFormAddToAlbumComponent;
  formCreateAlbum: ZPictureFormCreateAlbumComponent;
  addedToAlbumToast: ZAddedToAlbumToastComponent;
  createdAlbumToast: ZCreatedAlbumToastComponent;


  /**
   * Modal variables
   */
  showTag: boolean;
  showShare: boolean;

  public loadingService?: LoadingService;
  public toastsService?: ToastsService;
  public confirmationService?: ConfirmationService;

  constructor(private type: string,
              public apiService?: ApiBaseService) {
    this.category = type;
    // console.log('BaseMediaComponent', this);
  }

  ngOnInit() {
    // this.showTag = false;
    if (this.pageView == 'grid') {
      this.isGridView = true;
      this.isListView = false;
    } else if (this.pageView == 'list') {
      this.isGridView = false;
      this.isListView = true;
    }
    this.loadItems(this.currentPage);
  }

  ngOnChanges() {
    console.log('changed', this);
  }

  ngOnDestroy() {
    this.items = [];
  }

  changeView(view: any) {
    this.pageView = view;
    if (this.pageView == 'grid') {
      this.isGridView = true;
      this.isListView = false;
    } else if (this.pageView == 'list') {
      this.isGridView = false;
      this.isListView = true;
    }
  }

  addFavourite(event: any, item: any = null) {

    // this.loadingService.start();

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

    this.apiService.post(`${this.buildPathByCat()}/favourite`, body)
      .map(res => res.json())
      .subscribe((result: any) => {
          // stop loading
          _.map(newFavourite, (v: any)=> {
            let vitem = _.find(this.items, ['id', v.id]);
            vitem.favorite = setFavourite;
          });
          // // this.items =
          //
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

  delete(event: any) {
    this.needToReload = false;
    if (event) {
      this.confirmationService.confirm({
        message: 'Are you sure to delete ' + this.selectedItems.length + ' item' + (this.selectedItems.length > 1 ? 's' : '') + ' ?',
        accept: () => {
          let body = JSON.stringify({ids: _.map(this.selectedItems, 'id')});
          this.loadingService.start();
          this.apiService.post(`${this.buildPathByCat()}/delete`, body)
            .map(res => res.json())
            .subscribe((result: any) => {
                // stop loading
                this.needToReload = true;
                this.loadItems(this.currentPage);
                this.loadingService.stop();

                this.toastsService.success('Delete success');
              },
              error => {
                // stop loading
                this.loadingService.stop();
                this.toastsService.danger(error);
                console.log(error);
              }
            );
        }
      });
    }
  }

  onImgsSelected(event: any) {
    let _this = this;
    this.selectedItems = [];
    _.map(event, function (v: any) {
      _this.selectedItems.push(_.find(_this.items, ['id', v]));
    });
    this.selectedPhotos.emit(event);
    this.selectedPhotoFull.emit(this.selectedItems);
  }

  // code new
  getBaseMediaAction(action: string) {
    this.sendBaseMediaAction = action;
  }

  clearBaseMediaAction() {
    this.getBaseMediaAction('clearAll');
  }

  // end code new

  showInfo(event: any) {
    this.getAction = {
      action: 'info',
      status: true
    };
  }

  /*public loadItems(page: number) {
   if (page <= Math.ceil(this.total / this.perPage)) {
   this.loadingService.start('#photodata-loading');
   this.currentPage = page;
   this.apiService.get(`${this.buildPathByCat()}?page=${page}`).subscribe(
   (response: any) => {
   this.perPage = response['per_page'];
   this.total = response['total'];
   if (page == 1) {
   this.items = response['data'];
   }
   if (!_.isEqual(this.items, response['data'])) {
   this.items = _.concat(this.items, response['data']);
   }
   this.loadingService.stop('#photodata-loading');
   },
   error => {
   // this.errorMessage = <any>error;
   this.loadingService.stop('#photodata-loading');
   }
   );

   }
   }*/

  public loadItems(page: number) {
    this.loadingService.start('#photodata-loading');
    this.apiService.get(`${this.buildPathByCat()}`).subscribe(
      (response: any) => {
        console.log(response);
        this.items = response['data'];
        this.loadingService.stop('#photodata-loading');
      },
      error => {
        // this.errorMessage = <any>error;
        this.loadingService.stop('#photodata-loading');
      }
    );
  }

  public loadItemsByUrl(url: string) {
    if (this.currentPage <= Math.ceil(this.total / this.perPage)) {
      this.apiService.get(url).subscribe(
        (response: any) => {
          // console.log(response);
          this.perPage = response['per_page'];
          this.total = response['total'];
          this.items = response['data'];
        },
        error => {
          // this.errorMessage = <any>error;
          this.loadingService.stop('#photodata-loading');
        }
      );
    }
  }


  onCreateNewAlbum(photos?: any) {
    this.addItems = this.selectedItems;
    if (photos) {
      this.addItems = photos;
    }
    this.formAddToAlbum.hide();
    this.formCreateAlbum.show();
  }

  onFormResult(res: any) {
    if (res) {
      let body = JSON.stringify({name: res['album-name'], description: res['album-description']});
      this.apiService.post('/zone/albums', body)
        .subscribe(res => {
          this.toastsService.success('Created Album');
        })
      ;
    }
  }

  toggleModal(event: any, type: string) {
    switch (type) {
      case 'tag':
        this.showTag = !this.showTag;
        break;
      case 'share':
        this.showShare = !this.showShare;
        break;
    }
  }

  onHideCreateAlbumModal() {
    this.formCreateAlbum.hide();
  }

  onAddToAlbum(photos?: any) {
    this.addItems = this.selectedItems;
    if (photos) {
      this.addItems = photos;
    }
    this.formAddToAlbum.show();
  }

  onHideAddToAlbumModal() {
    this.formAddToAlbum.hide();
  }

  onDoneCreateFormModal(e: any) {
    this.formCreateAlbum.hide();
    if (e instanceof Album) {
      this.createdAlbumToast.show();
      this.album = e;
    } else {
      this.createdAlbumToast.hide();
      this.addedToAlbumToast.show();
      this.albumPhotos = e;
    }
  }

  onHideCreateAlbumToast() {
    this.createdAlbumToast.hide();
  }

  onDoneAddToAlbum(e: any) {
    this.formAddToAlbum.hide();
    this.addedToAlbumToast.show();
    this.albumPhotos = e;
  }

  onHideAddedToAlbumToast() {
    this.addedToAlbumToast.hide();
  }

  hasOpeningModal(): boolean {
    return (this.showTag);
  }

  /**
   * Put all private methods below
   */

  /**
   *
   * @returns {any}
   */
  private buildPathByCat(): string {
    if (this.category == MediaType.photo) {
      return 'zone/photos';
    }
    if (this.category == MediaType.album) {
      return 'zone/albums';
    }
    if (this.category == MediaType.albumDetail) {
      return 'zone/photos';
    }
    if (this.category == MediaType.favourites) {
      return 'zone/favorites';
    }
    if (this.category == MediaType.sharedWithMe) {
      return 'zone/share_with_me'; // get API
    }
    return 'zone/photos';
  }
}
