import {
  Component, AfterViewInit, Input, EventEmitter, Output, HostListener, ViewChild,
  ViewContainerRef, ComponentFactoryResolver, OnInit, OnChanges, SimpleChanges
} from '@angular/core';
import { Location } from '@angular/common';
import { ConfirmationService } from 'primeng/components/common/api';
import { Router, ActivatedRoute } from '@angular/router';
import { ZMediaToolbarComponent } from '../toolbar/toolbar.component';
import { SharingModalComponent } from './sharing/sharing-modal.component';
import { TaggingModalComponent } from './tagging/tagging-modal.component';
import { PhotoEditModalComponent } from './photo-edit-modal.component';
import { AddToAlbumModalComponent } from './add-to-album-modal.component';
import { PhotoService } from '../../../services/photo.service';
import { LoadingService } from '../../../../partials/loading/loading.service';
import { PhotoEditComponent } from '../edit/edit-photo.component';
import { ApiBaseService } from '../../../services/apibase.service';
import { BaseMediaModal } from './base-media-modal';
import { Photo } from '../../../models/photo.model';


declare let $: any;
declare let _: any;
const KEY_ESC = 27;
declare let saveAs: any;
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
    PhotoEditComponent,
    TaggingModalComponent
  ]
})
export class PhotoDetailModalComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() module: string;
  @Input() photo: Photo;
  @Input() loading: boolean;
  @Input() ids: Array<number>;
  @Input() mode: number;


  @Input() selectedPhotos: any = [];
  @Input() allPhotos: any = [];

  @Input() mediaToolbar: ZMediaToolbarComponent;

  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('formEdit') formEdit: PhotoEditModalComponent;
  @ViewChild('zoneSharing') zoneSharing: SharingModalComponent;
  @ViewChild('zoneTagging') zoneTagging: TaggingModalComponent;

  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;

  modalComponent: any;
  modal: any;

  index: number = 0;
  objects: any;

  image: any;
  cropper: any = null;

  private showDetails: boolean = false;
  private show: boolean = false;
  private canDelete: boolean = true;
  private editing: boolean = false;

  private degree: number = 0;
  private cropping: boolean;

  private cropperDefaultOptions: any = {
    viewMode: 2,
    dragMode: 'none',
    autoCropArea: 1,
    autoCrop: false,
    center: true
  };


  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    if (ev.which === KEY_ESC) this.goBack();
  }

  constructor(private resolver: ComponentFactoryResolver,
              private photoService: PhotoService,
              private confirmationService: ConfirmationService,
              private location: Location,
              private apiBaseService: ApiBaseService,
              private loadingService: LoadingService) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.loading) {
      this.open({show: true});
    } else {
      this.selectedPhotos[0] = this.photo;
      this.initCropper();
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

    // $('.photo-detail-img img').load(function () {
    //   if ($(this).height() > 100) {
    //     $(this).addClass('bigImg');
    //   }
    // });

  }

  // true --> next
  // false --> pre
  move(direction: boolean = true): void {
    let index = 0;
    let currentIndex = _.indexOf(this.ids, this.photo.id);
    if(direction) {
      index = currentIndex < (this.ids.length - 1) ? currentIndex + 1: 0;
    } else {
      index = currentIndex > 0 ? currentIndex - 1 : this.ids.length - 1;
    }
    this.event.emit({action: 'loadItem', id: this.ids[index]});
  }

  // Change image when delete current one: next, prev or go back to photo list
  deleteAndChangeImg() {
    console.log('Change image - current index: ', this.index, ' selectedPhotos: ', this.selectedPhotos);
    // Remove images at index position
    this.selectedPhotos.splice(this.index, 1);
    if (this.selectedPhotos.length == 0)
      this.goBack();
    // else
    //   this.imgNext();
  }


  doAction(event: any) {
    switch (event.action) {
      case 'favourite':
        this.onFavourite();
        break;
      case 'openModal':
        this.openModal(event.params.modalName);
        // this.mediaToolbar.zoneSharing.modal.open();
        break;
      case 'delete':
        this.onDelete();
        break;
      case 'viewInfo':
        this.onShowInfo();
        break;
      case 'editInfo':
        this.onEditInfo(event.data);
        break;
      case 'addToAlbum':
        this.mediaToolbar.formAddAlbum.modal.open();
        break;
      case 'download':
        _.each(event.params.selectedObjects, (file: any) => {
          this.apiBaseService.download('media/files/download', {id: file.id}).subscribe(
            (response: any) => {
              var blob = new Blob([response.blob()], {type: file.content_type});
              saveAs(blob, file.name);
            },
            (error: any) => {

            }
          );
        });

        break;
      case 'confirmDeleteMedia':
        this.confirmDeleteMedia(event.params);
        break;
      default:
        this.event.emit(event);
        break;
    }

    return false;
  }


  open(options: any) {
    if (_.has(options, 'show')) {
      this.show = options.show;
    }
  }

  close(options: any) {
    this.modal.close();
  }

  goBack() {
    this.event.emit({action: 'goBack'})
  }

  onShowInfo() {
    console.log('show details', this.showDetails);
    this.showDetails = !this.showDetails;
  }

  onEditInfo(data?: any) {
    this.formEdit.onShow();
  }

  ////////////////////////////////////////////////////CROPPER/////////////////////////////////////

  editPhoto() {
    this.setMode(1);
    this.event.emit({action: 'editPhoto'})
  }

  setMode(mode: number) {
    if (mode == 1) {
      $('.cropper-crop-box').show();
    } else {
      $('.cropper-crop-box').hide();
    }
    this.mode = mode;
  }

  initCropper(){
    if (this.cropper == null) {
      let image = document.getElementById('photo-detail-image');
      this.cropper = new Cropper(image, {
        dragMode: 'none',
        autoCrop: true,
        autoCropArea: 1,
        viewMode: 2,
        modal: false,
        ready: () => {
          // hide crop area on view mode
          $('.cropper-crop-box').hide();
        }
      });
    }
    this.cropper.replace(this.photo.url);
  }

  rotateCropper(leftDirect?: boolean) {
    this.cropper.rotate(leftDirect ? -90 : 90);
  }

  cropCropper() {
    if(this.cropping) {
      this.cropper.setDragMode('move');
    } else {
      this.cropper.setDragMode('crop');
    }
    this.cropping = !this.cropping;
  }

  cropperZoom(ratio: any) {
    if (ratio == 0) {
      this.cropper.reset();
    } else if (ratio == 0.1) {
      this.cropper.zoom(0.1);
    } else {
      this.cropper.zoom(-0.1);
    }
  }

  cancel() {
    this.cropper.reset();
    this.setMode(0);
  }

  cropperDone() {
    let editingData = this.cropper.getCroppedCanvas().toDataURL(this.photo.content_type);
    this.cropper.replace(editingData);
    this.editing = true;
  }

  cropperSave() {
    // get cropped image data
    let editedData = this.cropper.getCroppedCanvas().toDataURL(this.photo.content_type);

    this.confirmationService.confirm({
      message: 'Do you want to save editing item',
      header: 'Save Photo',
      accept: () => {
        this.event.emit({action: 'updatePhoto', editedData: editedData});

        // this.apiBaseService.post('media/photos', {
        //   name: this.photo.name + `.${this.photo.extension}`,
        //   type: this.photo.content_type,
        //   file: editedData
        // }).subscribe((res:any) => {
        //   this.event.emit(res);
        // });
      }
    });
  }
  /////////////////////////////////////////END-CROPPER/////////////////////////////////////

  openModal(modalName: string) {
    let options: any;
    switch (modalName) {
      case 'editInfoModal':
        this.loadModalComponent(PhotoEditModalComponent);
        options = {selectedObject: this.selectedPhotos[0]};
        break;
      case 'sharingModal':
        this.loadModalComponent(SharingModalComponent);
        options = {selectedObjects: [this.selectedPhotos[this.index]]};
        break;
      case 'taggingModal':
        this.loadModalComponent(TaggingModalComponent);
        options = {
          selectedObjects: [this.selectedPhotos[this.index]],
          updateListObjects: [this.objects, this.selectedPhotos]
        };
        break;
      case 'addToAlbumModal':
        this.loadModalComponent(AddToAlbumModalComponent);
        options = {selectedObjects: this.selectedPhotos};
        break;
    }
    this.modal.open(options);

  }

  private onFavourite() {
    this.photoService.actionOneFavourite(this.selectedPhotos[this.index]).subscribe((res: any)=> {
      if (res.message === 'success') {
        this.selectedPhotos[this.index].favorite = !this.selectedPhotos[this.index].favorite;
      }
    });
  }

  private onDelete() {
    let idPhoto = this.selectedPhotos[this.index].id;
    this.confirmationService.confirm({
      message: 'Are you sure to delete 1 item?',
      accept: () => {
        let body = JSON.stringify({ids: [idPhoto]});
        this.loadingService.start();
        this.photoService.deletePhoto(body).subscribe((res: any)=> {
          this.goBack();
          _.remove(this.allPhotos, ['id', idPhoto]);
          this.loadingService.stop();
        });
      }
    });
  }

  private loadModalComponent(component: any) {
    let modalComponentFactory = this.resolver.resolveComponentFactory(component);
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(modalComponentFactory);
    this.modal = this.modalComponent.instance;
  }

  confirmDeleteMedia(params: any) {
    // Ask for user confirmation before delete media items
    let photos = _.filter(params.selectedObjects, (o: any) => o.object_type == 'photo');
    let albums = _.filter(params.selectedObjects, (o: any) => o.object_type == 'album');
    let photos_count = photos.length  + (photos.length > 1 ? ' photos?' : ' photo?');

    if( photos.length > 0 ) {
      // Ask for user confirmation before deleting selected PHOTOS
      this.confirmationService.confirm({
        message: 'Are you sure to delete ' + photos_count,
        accept: () => {
          this.loadingService.start();
          this.apiBaseService.post('media/media/delete', {objects: photos, child_destroy: params.child_destroy}).subscribe(
            (res: any) => {
              _.map(photos, (obj: any)=> {
                _.remove(this.objects, {'id': obj.id, 'object_type': obj.object_type});
              });
              this.loadingService.stop();
              this.deleteAndChangeImg();
            },
            (error: any) => this.loadingService.stop());
        },
        reject: () => {
          // Ask for user confirmation before deleting selected ALBUMS
        }
      });
    }
  }
}
