import {
  Component,
  AfterViewInit,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ViewEncapsulation,
  Renderer2
} from '@angular/core';

import { Constants } from '@shared/constant';
import { PhotoService } from '@shared/services';
import * as Cropper from 'cropperjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharingModalComponent } from '../modal/sharing/sharing-modal.component';
import { TaggingModalComponent } from '../modal/tagging/tagging-modal.component';
import { PhotoEditModalComponent } from '../modal/photo/photo-edit-modal.component';
import { AddToAlbumModalComponent } from '../modal/photo/add-to-album-modal.component';

declare let $: any;
declare let _: any;
const viewSize = 5;

@Component({
  selector: 'photo-detail-partial',
  templateUrl: 'photo-detail-partial.component.html',
  styleUrls: ['photo-detail-partial.component.scss'],
  encapsulation: ViewEncapsulation.None,
  entryComponents: [
    PhotoEditModalComponent,
    SharingModalComponent,
    TaggingModalComponent
  ]
})
export class PhotoDetailPartialComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() module: string;
  @Input() photo: any;
  @Input() loading: boolean;
  @Input() ids: Array<number>;
  @Input() mode: number;
  @Input() showDetail: boolean;
  @Input() hasPreviousItem: boolean;
  @Input() hasNextItem: boolean;
  @Input() batchItems: Array<any> = [];
  @Input() isOwner: boolean;
  @Input() recipients: Array<any> = [];
  @Input() albums: Array<any> = [];
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('modalContainer', { read: ViewContainerRef })
  modalContainer: ViewContainerRef;
  tooltip: any = Constants.tooltip;
  menus: any = [];

  modalComponent: any;
  modal: any;

  hasEditPhoto = false;
  currentIndex = 0;
  cropper: any;
  image: any;
  loadingImg = true;
  defaultCapabilities: any = {
    canView: true,
    canDownload: false,
    canFave: false,
    canShare: false,
    canTag: false,
    canEdit: false,
    canDelete: false
  };

  capabilities: any = this.defaultCapabilities;
  profileUrl = `${Constants.baseUrls.social}/profile/`;
  mediaUrl = Constants.baseUrls.media;
  showMore = false;
  index = 0;
  objects = [];
  destroySubject: Subject<any> = new Subject<any>();

  constructor(
    private resolver: ComponentFactoryResolver,
    private photoService: PhotoService,
    private renderer: Renderer2
  ) {
    this.renderer.addClass(document.body, 'modal-open');
  }

  ngOnInit() {
    this.loadMenu();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.photo) {
      // this.currentIndex = _.indexOf(this.ids, this.photo.id);
      this.stop();
      this.capabilities = this.photo.capabilities || this.defaultCapabilities;

      if (this.batchItems.length > 0) {
        this.batchItems.forEach((item, i) => {
          if (this.photo.id === item.id) {
            this.currentIndex = i;
            return;
          }
        });
      }

      if (this.batchItems.length > 1) {
        let index = -1;
        this.batchItems.forEach((item, i) => {
          if (item.id === this.photo.id) {
            index = i;
          }
        });

        if (index > 0 && index <= this.batchItems.length) {
          this.hasPreviousItem = true;
        }
        if (index >= 0 && index < this.batchItems.length) {
          this.hasNextItem = true;
        }
      }
    }

    if (this.albums.length > 0) {
      this.loadMoreAlbums(this.index);
    }


    this.loadMenu();
  }

  ngAfterViewInit() {


  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'modal-open');
    this.event.emit({ action: 'destroy' });
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  loadMenu() {
    this.menus = new Array<any>();
    const canDelete = this.module !== 'social';

    this.menus = [
      {
        text: 'Share',
        toolTip: Constants.tooltip.share,
        iconClass: 'fa fa-share-alt',
        action: 'openModal',
        display: this.capabilities.canShare,
        params: { modalName: 'sharingModal' }
      },
      {
        text: 'Favourite',
        toolTip: Constants.tooltip.favourite,
        iconClass: 'fa fa-star',
        display: this.capabilities.canFave,
        action: 'favourite'
      },
      {
        text: 'Tag',
        toolTip: Constants.tooltip.tag,
        iconClass: 'fa fa-tag',
        action: 'openModal',
        display: this.capabilities.canTag,
        params: { modalName: 'taggingModal' }
      },
      // {
      //   text: 'Edit',
      //   toolTip: Constants.tooltip.edit,
      //   iconClass: 'fa fa-edit',
      //   action: 'editPhoto',
      //   canEdit: this.canEdit
      // },
      {
        text: 'More',
        toolTip: Constants.tooltip.moreAction,
        iconClass: 'fa fa-ellipsis-v',
        dropdown: true,
        parent: true,
        menus: [
          {
            text: 'Add to album',
            toolTip: Constants.tooltip.addToAlbum,
            iconClass: 'fa fa-plus-square',
            action: 'openModal',
            display: this.capabilities.canEdit,
            params: { modalName: 'addToAlbumModal' }
          },
          {
            text: 'Download',
            toolTip: Constants.tooltip.download,
            iconClass: 'fa fa-download',
            action: 'download',
            display: this.capabilities.canDownload,
            params: {}
          },
          {
            text: 'View Info',
            toolTip: Constants.tooltip.viewInfo,
            iconClass: 'fa fa-info-circle',
            action: 'viewInfo',
            display: this.capabilities.canView
          }
        ]
      }
    ];

    if (this.isOwner) {
      this.menus.splice(3, 0, {
        text: 'Edit',
        toolTip: Constants.tooltip.edit,
        iconClass: 'fa fa-edit',
        action: 'editPhoto',
        display: this.capabilities.canEdit
      });
    }

    if (canDelete) {
      this.menus.splice(4, 0, {
        text: 'Delete',
        toolTip: Constants.tooltip.delete,
        iconClass: 'fa fa-trash-o',
        action: 'confirmDelete',
        display: this.capabilities.canDelete,
        params: {}
      });
    }
  }

  openModal(modalName: string) {
    let options: any;
    switch (modalName) {
      case 'editInfoModal':
        this.loadModalComponent(PhotoEditModalComponent);
        options = { selectedObject: this.photo };
        break;
      case 'sharingModal':
        this.loadModalComponent(SharingModalComponent);
        options = { selectedObjects: [this.photo] };
        break;
      case 'taggingModal':
        this.loadModalComponent(TaggingModalComponent);
        options = {
          selectedObjects: [this.photo],
          updateListObjects: [this.photo]
        };
        break;
      case 'addToAlbumModal':
        this.loadModalComponent(AddToAlbumModalComponent);
        options = { selectedObjects: [this.photo] };
        break;
    }
    this.modal.open(options);
  }

  // New code

  goBack() {
    this.event.emit({ action: 'goBack' });
  }

  doAction(event: any) {
    console.log('event:', event);
    switch (event.action) {
      case 'openModal':
        this.openModal(event.params.modalName);
        break;
      case 'viewInfo':
        this.showInfo();
        break;
      case 'editPhoto':
        this.editPhoto();
        break;
      case 'cancelEdit':
        this.hasEditPhoto = false;
        break;
      case 'savePhoto':
        this.savePhoto(event.data);
        break;
      default:
        this.event.emit(event);
        break;
    }
    return false;
  }

  /**
   * true --> next
   * false --> pre
   * @param {boolean} direction
   */
  onMove(direction: boolean = true): void {
    let index = 0;

    if (direction) {
      index =
        this.currentIndex < this.batchItems.length - 1 ? this.currentIndex + 1 : 0;
      if (index >= 0 && index < this.batchItems.length) {
        this.hasPreviousItem = true;
      }
    } else {
      index =
        this.currentIndex > 0 ? this.currentIndex - 1 : this.batchItems.length - 1;
      if (index > 0 && index <= this.batchItems.length) {
        this.hasNextItem = true;
      }
    }
    // this.event.emit({ action: 'loadItem', id: this.ids[index] });
    this.event.emit({ action: 'loadItem', id: this.batchItems[index].uuid });
  }

  onZoomIn() {
    this.cropper.zoom(0.1);
  }

  onZoomOut() {
    this.cropper.zoom(-0.1);
  }

  onRefresh() {
    this.cropper.reset();
    this.cropper.setDragMode('none');
  }

  onStart(event?: any) {
    this.image =
      event && event.path
        ? event.path[0]
        : document.getElementById('image-viewer');
    this.cropper = new Cropper(this.image, {
      autoCrop: false,
      // dragMode: 'move',
      dragMode: 'none',
      background: false,
      viewMode: 1, // restrict the crop box to not exceed the size of the canvas.
      // viewMode: 2, // restrict the minimum canvas size to fit within the container.
      ready: () => {
        setTimeout(() => {
          this.loadingImg = false;
        }, 200);
      },
      zoom: (e: any) => {
        if (e.detail.ratio !== e.detail.oldRatio) {
          this.cropper.setDragMode('move');
        }
      }
    });
  }

  viewAlbumDetails(album: any) {
    this.event.emit({ action: 'viewAlbumDetails', payload: { item: album, returnUrl: location.pathname } });
  }

  loadMoreAlbums(index: number) {
    for (let i = index; (i < index + viewSize) && i < this.albums.length; i++) {
      this.showMore = i < this.albums.length - 1 ? true : false;
      if (i >= index + viewSize) {
        break;
      }
      this.objects.push(this.albums[i]);
      this.index++;
    }
  }

  private stop() {
    if (this.cropper) {
      this.loadingImg = true;
      this.cropper.destroy();
      this.cropper = null;
    }
  }

  private editPhoto() {
    this.hasEditPhoto = true;
    // this.event.emit({action: 'editPhoto'});
  }

  private savePhoto(dataImg: any) {
    this.photoService.confirmUpdate(this.photo, dataImg).then((data: any) => {
      // this.event.emit({ action: 'photoUpdated', payload: data });
      this.photo.url = `${data.url}?t=${+new Date()}`;
      $('.cropper-canvas')[0].childNodes[0].src = this.photo.url;

      this.hasEditPhoto = false;
    });
  }

  private showInfo() {
    this.showDetail = !this.showDetail;
    if (this.recipients.length === 0 && this.showDetail) {
      this.event.emit({ action: 'media:photo:load_sharing_info' });
    }
  }

  private loadModalComponent(component: any) {
    const modalComponentFactory = this.resolver.resolveComponentFactory(
      component
    );
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(
      modalComponentFactory
    );
    this.modal = this.modalComponent.instance;
    this.modal.event.pipe(takeUntil(this.destroySubject)).subscribe((event: any) => {
      this.doAction(event);
    });
  }
}
