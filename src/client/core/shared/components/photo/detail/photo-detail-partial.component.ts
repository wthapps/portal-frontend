import {
  Component, AfterViewInit, Input, EventEmitter, Output, ViewChild,
  ViewContainerRef, ComponentFactoryResolver, OnInit, OnChanges, SimpleChanges, OnDestroy
} from '@angular/core';

import { SharingModalComponent } from '../modal/sharing/sharing-modal.component';
import { PhotoEditModalComponent } from '../modal/photo-edit-modal.component';
import { AddToAlbumModalComponent } from '../modal/add-to-album-modal.component';
import { TaggingModalComponent } from '../modal/tagging/tagging-modal.component';
import { Constants } from '../../../config/constants';
import { PhotoService } from '../../../services/photo.service';

declare let $: any;
declare let _: any;
declare let Cropper: any;

@Component({
  moduleId: module.id,
  selector: 'photo-detail-partial',
  templateUrl: 'photo-detail-partial.component.html',
  styleUrls: ['photo-detail-partial.component.css'],
  entryComponents: [
    SharingModalComponent,
    PhotoEditModalComponent,
    AddToAlbumModalComponent,
    TaggingModalComponent
  ]
})
export class PhotoDetailPartialComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @Input() module: string;
  @Input() photo: any;
  @Input() loading: boolean;
  @Input() ids: Array<number>;
  @Input() mode: number;
  @Input() showDetail: boolean;
  @Input() recipients: Array<any> = [];
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;

  tooltip: any = Constants.tooltip;

  modalComponent: any;
  modal: any;
  cropper: any = null;
  menus: Array<any>;
  currentIndex: number = 0;
  editingData: any = null;

  imgZoomClass: number = 0;
  imgZoomMin: number = -10;
  imgZoomMax: number = 24;

  editing: boolean = false;
  cropping: boolean;
  readonly DEFAULT_IMAGE: string = Constants.img.default;
  private cropperDefaultOptions: any = {
    viewMode: 2,
    dragMode: 'none',
    autoCropArea: 1,
    autoCrop: false,
    center: true
  };

  constructor(private resolver: ComponentFactoryResolver,
              private photoService: PhotoService) {
  }

  ngOnInit() {
    this.loadMenu();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.loading) {
      console.log(this.loading);
    } else {
      this.currentIndex = _.indexOf(this.ids, this.photo.id);
      // this.initCropper();
    }
  }

  ngAfterViewInit() {
    let self = this;
    $('body').on('click', '#photo-box-detail figure', () => self.goBack());

    $('body').on('click',
      '#photo-box-detail figure #photo-detail-img, .photo-detail-img-control, .cropper-container, #photo-detail-image'
      , (e: any) => {
        e.stopPropagation();
      });
  }

  ngOnDestroy() {
    this.event.emit({action: 'destroy'});
  }

  loadMenu() {
    this.menus = new Array<any>();
    let canDelete = this.module !== 'social';

    this.menus = [
      {
        text: 'Share',
        toolTip: Constants.tooltip.share,
        iconClass: 'fa fa-share-alt',
        action: 'openModal',
        params: {modalName: 'sharingModal'}
      },
      {
        text: 'Favourite',
        toolTip: Constants.tooltip.favourite,
        iconClass: 'fa fa-star',
        action: 'favourite'
      },
      {
        text: 'Tag',
        toolTip: Constants.tooltip.tag,
        iconClass: 'fa fa-tag',
        action: 'openModal',
        params: {modalName: 'taggingModal'}
      },
      {
        text: 'Edit',
        toolTip: Constants.tooltip.edit,
        iconClass: 'fa fa-edit',
        action: 'editPhoto'
      },
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
            params: {modalName: 'addToAlbumModal'}
          },
          {
            text: 'Download',
            toolTip: Constants.tooltip.download,
            iconClass: 'fa fa-download',
            action: 'download',
            params: {}
          },
          {
            text: 'View Info',
            toolTip: Constants.tooltip.viewInfo,
            iconClass: 'fa fa-info-circle',
            action: 'viewInfo'
          }
        ]
      }
    ];

    if (canDelete)
      this.menus.splice(4,0,
        {
          text: 'Delete',
          toolTip: Constants.tooltip.delete,
          iconClass: 'fa fa-trash-o',
          action: 'confirmDelete',
          params: {}
        });
  }

  // true --> next
  // false --> pre
  move(direction: boolean = true): void {
    let index = 0;

    if (direction) {
      index = this.currentIndex < (this.ids.length - 1) ? this.currentIndex + 1 : 0;
    } else {
      index = this.currentIndex > 0 ? this.currentIndex - 1 : this.ids.length - 1;
    }
    this.event.emit({action: 'loadItem', id: this.ids[index]});
  }

  doAction(event: any) {
    switch (event.action) {
      case 'openModal':
        this.openModal(event.params.modalName);
        break;
      case 'viewInfo':
        this.onShowInfo();
        break;
      case 'editPhoto':
        this.editPhoto();
        break;
      default:
        this.event.emit(event);
        break;
    }
    return false;
  }

  goBack() {
    this.event.emit({action: 'goBack'});
  }

  onShowInfo() {
    this.showDetail = !this.showDetail;
    if(this.recipients.length == 0 && this.showDetail == true) {
      this.event.emit({action: 'media:photo:load_sharing_info'});
    }
  }

  ////////////////////////////////////////////////////CROPPER/////////////////////////////////////

  editPhoto() {
    this.initCropper();
    this.setMode(1);
    this.event.emit({action: 'editPhoto'});
  }

  setMode(mode: number) {
    // if (mode == 1) {
    //   $('.cropper-crop-box').show();
    // } else {
    //   $('.cropper-crop-box').hide();
    // }
    this.mode = mode;
  }

  initCropper() {
    this.clearCropper();
    console.debug('after clear cropper: ', this.cropper);
    if (this.cropper == null) {
      console.debug('init cropper ...');
      let image = document.getElementById('photo-detail-image');
      this.cropper = new Cropper(image, {
        dragMode: 'none',
        // autoCrop: true,
        // autoCropArea: 0,
        // viewMode: 2,
        modal: false,
        ready: () => {
          // hide crop area on view mode
          $('.cropper-crop-box').hide();
        },
        cropstart: () => {
          $('.cropper-crop-box').show();
        }
      });
    }
    this.cropper.replace(this.photo.url);
  }

  clearCropper() {
    console.debug('Clear cropper ...');
    if(this.cropper !== null) {
      this.cropper.clear();
      this.cropper = null;
    }
  }

  rotateCropper(leftDirect: boolean) {
    this.editing = leftDirect == undefined ? false : true;
    this.cropper.rotate(leftDirect ? -90 : 90);
  }

  cropCropper() {
    if (this.cropping) {
      this.cropper.setDragMode('none');
      this.editing = false;
    } else {
      this.cropper.setDragMode('crop');
      this.editing = true;
    }
    this.cropping = !this.cropping;

  }

  zoomCropper(ratio: any) {
    this.editing = ratio != 0 ? true : false;
    if (ratio == 0) {
      this.cropper.reset();
    } else if (ratio == 0.1) {
      this.cropper.zoom(0.1);
    } else {
      this.cropper.zoom(-0.1);
    }
  }

  reset () {
    this.cropper.reset();
    this.cropper.setDragMode('none');
    this.cropping = false;
    this.editing = false;
  }

  cancel(noReset: boolean = false) {
    if(this.cropping) {
      $('.cropper-crop-box').hide();
    }
    this.editing = false;
    if(!noReset)
      this.cropper.reset();
    this.cropper.setDragMode('none');
    this.setMode(0);
  }

  cropperSave() {
    // get cropped image data
    let editedData = this.cropper.getCroppedCanvas().toDataURL(this.photo.content_type);
    this.photoService.confirmUpdate(this.photo, editedData)
      .then((data: any) => {
          this.event.emit({action: 'photoUpdated', payload: data});
          this.cancel(true);
        }
      );
    // this.event.emit({action: 'confirmUpdate', editedData: editedData});
    // this.cancel();
  }
  /////////////////////////////////////////END-CROPPER/////////////////////////////////////

  openModal(modalName: string) {
    let options: any;
    switch (modalName) {
      case 'editInfoModal':
        this.loadModalComponent(PhotoEditModalComponent);
        options = {selectedObject: this.photo};
        break;
      case 'sharingModal':
        this.loadModalComponent(SharingModalComponent);
        options = {selectedObjects: [this.photo]};
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
        options = {selectedObjects: [this.photo]};
        break;
    }
    this.modal.open(options);

  }

  private loadModalComponent(component: any) {
    let modalComponentFactory = this.resolver.resolveComponentFactory(component);
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(modalComponentFactory);
    this.modal = this.modalComponent.instance;
  }
}
