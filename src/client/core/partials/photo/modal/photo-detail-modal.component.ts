import {
  Component, AfterViewInit, Input, EventEmitter, Output, HostListener, ViewChild,
  ViewContainerRef, ComponentFactoryResolver, OnInit
} from '@angular/core';
import { Location } from '@angular/common';
import { ConfirmationService } from 'primeng/components/common/api';
import { Router, ActivatedRoute } from '@angular/router';
import { ZMediaToolbarComponent } from '../toolbar/toolbar.component';
import { SharingModalComponent } from './sharing/sharing-modal.component';
import { TaggingModalComponent } from './tagging/tagging-modal.component';
import { PhotoEditModalComponent } from '../../photo/form/photo-edit-modal.component';
import { AddToAlbumModalComponent } from './add-to-album-modal.component';
import { PhotoService } from '../../../shared/services/photo.service';
import { LoadingService } from '../../loading/loading.service';
import { PhotoEditComponent } from '../edit/edit-photo.component';
import { ApiBaseService } from '../../../shared/services/apibase.service';

declare let $: any;
declare let _: any;
const KEY_ESC = 27;
declare let saveAs: any;

@Component({
  moduleId: module.id,
  selector: 'photo-detail-modal',
  templateUrl: 'photo-detail-modal.component.html',
  styleUrls: ['photo-detail-modal.component.css'],
  entryComponents: [
    SharingModalComponent,
    PhotoEditModalComponent,
    AddToAlbumModalComponent,
    PhotoEditComponent,
    TaggingModalComponent
  ]
})
export class PhotoDetailModalComponent implements OnInit, AfterViewInit, BaseMediaModal {
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
  loadingImg: boolean = true;
  objects: any;

  img: any;

  private showDetails: boolean = false;
  private show: boolean = false;
  private canDelete: boolean = true;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    if (ev.which === KEY_ESC) this.goBack();
  }

  constructor(private router: Router,
              private route: ActivatedRoute,
              private resolver: ComponentFactoryResolver,
              private photoService: PhotoService,
              private confirmationService: ConfirmationService,
              private location: Location,
              private apiBaseService: ApiBaseService,
              private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.loadingImg = true;
    this.route.params.forEach((params: any) => {
      this.apiBaseService.get('zone/social_network/photos/' + params['id']).subscribe((res:any) => {
        this.selectedPhotos = [res.data];
        this.open({show: true});
      });
    });
  }

  ngAfterViewInit() {
    let _thisPhotoDetail = this;
    $('body').on('click', '#photo-box-detail figure', function () {
      _thisPhotoDetail.goBack();
    });
    $('body').on('click',
      '#photo-box-detail figure #photo-detail-img, .photo-detail-img-control, .cropper-container'
      , function (e: any) {
      e.stopPropagation();
    });

    $('.photo-detail-img img').load(function () {
      if ($(this).height() > 100) {
        $(this).addClass('bigImg');
      }
    });

    console.log('after init view  photo details');


  }

  onZoomReset(e: any) {
    console.log(e);
    this.reInitPhoto();
    this.img.cropper('clear');
    return false;
  }

  onZoomOut(e: any) {
    console.log(e);
    return false;
  }

  onZoomIn(e: any) {
    console.log(e);
    return false;
  }

  showLoading(e: any) {
    this.loadingImg = false;
  }

  imgPrev(): void {
    this.index = this.index - 1;
    if (this.index < 0) this.index = this.selectedPhotos.length - 1;
    this.loadingImg = true;
    // console.log(this.objects);
  }

  imgNext(): void {
    this.index = this.index + 1;
    if (this.index >= this.selectedPhotos.length) this.index = 0;
    this.loadingImg = true;
    // console.log(this.index, this.selectedPhotos, this.allPhotos);
  }

  // Change image when delete current one: next, prev or go back to photo list
  deleteAndChangeImg() {
    console.log('Change image - current index: ', this.index, ' selectedPhotos: ', this.selectedPhotos);
    // Remove images at index position
    this.selectedPhotos.splice(this.index, 1);
    if (this.selectedPhotos.length == 0)
      this.goBack();
    else
      this.imgNext();
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
              var blob = new Blob([response.blob()], { type: file.content_type });
              saveAs(blob, file.name);
            },
            (error: any) => {

            }
          );
        });

        break;
      default:
        this.event.emit(event);
        break;
    }

    return false;
  }


  open(options: any) {

    //get options values
    // if (_.has(options, 'showDetails')) {
    //   this.showDetails = options.showDetails;
    // }
    // if (_.has(options, 'show')) {
    //   this.active = options.show;
    // }
    // if (_.has(options, 'selectedObjects')) {
    //   this.selectedPhotos = options.selectedObjects;
    // }
    //
    // if (_.has(options, 'selectedObjects')) {
    //   this.selectedPhotos = options.selectedObjects;
    // }
    //
    // if (_.has(options, 'objects')) {
    //   this.objects = options.objects;
    // }
    // if (_.has(options, 'canDelete')) {
    //   this.canDelete = options.canDelete;
    // }
    //
    // if (this.selectedPhotos && this.selectedPhotos.length == 1) {
    //   this.selectedPhotos = this.objects;
    //   if (options.selectedObjects && options.selectedObjects.length > 0) {
    //     this.index = _.findIndex(this.objects, {'id': options.selectedObjects[options.selectedObjects.length - 1].id});
    //   } else {
    //     this.index = 0;
    //   }
    // } else {
    //   if (options.selectedObjects && options.selectedObjects.length > 0) {
    //     this.index = options.selectedObjects.length - 1;
    //   } else {
    //     this.index = 0;
    //   }
    // }

    if (_.has(options, 'show')) {
      this.show = options.show;
    }
  }


  close(options: any) {
    this.modal.close();
  }

  preview(show: boolean): void {
    // this.active = false;
    // this.collapseInfo = true;
  }

  goBack() {
    this.show = false;
    this.showDetails = false;
    this.location.back();
  }

  onShowInfo() {
    console.log('show details', this.showDetails);
    this.showDetails = !this.showDetails;
  }

  onEditInfo(data?: any) {
    this.formEdit.onShow();
  }

  onEditPhoto(uuid: any) {
    // this.router.navigate(['photos', uuid, 'edit']);
    this.loadModalComponent(PhotoEditComponent);
    this.modal.data = this.selectedPhotos[0];
  }

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
        options = {selectedItems: this.selectedPhotos};
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

  private reInitPhoto(): void {
    // Define variables
    let elImage = $('#photo-detail-img');
    elImage.cropper({
      viewMode: 2,
      dragMode: 'move',
      autoCropArea: 1,
      autoCrop: false
    });
    this.img = elImage;
  }
}
