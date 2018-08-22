import {
  Component,
  Input,
  EventEmitter,
  Output,
  TemplateRef,
  ViewEncapsulation,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver,
  OnInit,
  OnDestroy, AfterViewInit
} from '@angular/core';
import { Constants } from '@wth/shared/constant';
import { ApiBaseService, CommonEventService } from '@shared/services';
import { PlaylistCreateModalService } from '@shared/shared/components/photo/modal/playlist/playlist-create-modal.service';
import { MediaViewMixin } from '@media/shared/mixin/media-view.mixin';
import { Mixin } from '@shared/design-patterns/decorator/mixin-decorator';
import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
import { AlbumCreateMixin } from '@media/shared/mixin/album/album-create.mixin';
import { AlbumAddMixin } from '@media/shared/mixin/album/album-add.mixin';
import { Router } from '@angular/router';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { MediaAddModalService } from '@shared/shared/components/photo/modal/media/media-add-modal.service';
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import { WUploader } from '@shared/services/w-uploader';

@Mixin([MediaViewMixin, AlbumAddMixin, AlbumCreateMixin])
@Component({
  selector: 'w-toolbar',
  exportAs: 'wToolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WToolbarComponent implements OnInit, OnDestroy, MediaViewMixin, AlbumAddMixin, AlbumCreateMixin {
  @Input() leftActionsTemplate: TemplateRef<any>;
  @Input() objectActionsTemplate: TemplateRef<any>;
  @Input() moreActionsTemplate: TemplateRef<any>;

  @Input() object; // detail object
  @Input() selectedObjects: Array<any> = new Array<any>();
  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  viewModes: any = {
    grid: 'grid',
    list: 'list',
    timeline: 'timeline'
  };
  @Input() viewMode: any = this.viewModes.grid;
  favoriteAll: boolean = false;
  hasOneObject: boolean = false;
  hasManyObjects: boolean = false;
  hasNoObject: boolean = false;
  subCreateAlbum: any;
  subAddAlbum: any;
  subOpenCreateAlbum: any;
  subUploader: any;
  tooltip: any = Constants.tooltip;

  uppy: any;

  constructor(
    public apiBaseService: ApiBaseService,
    public resolver: ComponentFactoryResolver,
    public toastsService: ToastsService,
    public router: Router,
    public mediaAddModalService: MediaAddModalService,
    public mediaCreateModalService: MediaCreateModalService,
    public mediaUploaderDataService: MediaUploaderDataService,
    public playlistCreateModalService: PlaylistCreateModalService,
    private commonEventService: CommonEventService,
    private uploader: WUploader
    ) {

    }

  ngOnInit() {
    this.subUploader = this.mediaUploaderDataService.action$.subscribe(e => {
      switch (e.action) {
        case 'openModal':
          if (e.payload.modalName == 'createAlbumModal') {
            this.openCreateAlbumModal(e.payload.selectedObjects);
          }
          if (e.payload.modalName == 'addToAlbumModal') {
            this.openModalAddToAlbum(e.payload.selectedObjects);
          }
          break;
      }
    });
  }

  upload(content_types: any = []) {

    this.uploader.open('FileInput', '.w-uploader-file-input-container', {
      allowedFileTypes: content_types
    });
    // document.getElementsByClassName('uppy-FileInput-btn')[0].click();
    // const fileInput = document.getElementById('w-uploader-select-files-input').click();

    // fileInput.handleChange(change => {
    //   console.log('handle change:::');
    // });
    // document.querySelectorAll('.w-uploader-select-files-input').forEach(fileInput => {
    //   this.wUploader.fileUpload(fileInput);
    // });
  }

  ngOnDestroy() {
    if (this.subUploader) this.subUploader.unsubscribe();
  }

  doAction(event: any) {
    if (event.action === 'favourite') {
      event.payload.selectedObjects.map(
        object =>
          (object.favorite = event.payload.mode === 'add' ? true : false)
      );
      this.updateSelectedObjects(event.payload.selectedObjects);
    }
    if (event.action === 'deselectAll') {
      this.selectedObjects.length = 0;
      this.updateSelectedObjects([]);
    }
    if (event.action === 'openModalCreatePlayListModal') {
      this.playlistCreateModalService.open.next({selectedObjects: this.selectedObjects});
    }
    if (event.action === 'openModalCreateAlbumModal') {
      this.openCreateAlbumModal(this.selectedObjects);
    }
    this.event.emit(event);
  }

  updateSelectedObjects(objects: Array<any>) {
    this.selectedObjects = objects;
    this.favoriteAll = this.checkFavoriteAll(this.selectedObjects);
    this.hasManyObjects = this.selectedObjects.length > 1 ? true : false;
    this.hasOneObject = this.selectedObjects.length === 1 ? true : false;
    this.hasNoObject = this.selectedObjects.length === 0 ? true : false;
  }

  uploaVideodHandler(files: any) {
    const data = files.map(file => {
      return { file: file.result, name: file.name, type: file.type };
    });
    data.forEach(f => {
      this.apiBaseService.post(`media/videos`, f).subscribe(res => {
        this.event.emit({ action: 'uploaded', payload: [...files] });
      });
    });
  }

  errorHandler(error: any) {
    if (error.statusCode == 406 && error.error == 'Not Acceptable') {
      this.commonEventService.broadcast({ channel: 'LockMessage', payload: error.files });
    }
  }

  changeViewMode(mode: any) {
    this.event.emit({action: 'changeView', payload: mode})
  }

  /* AlbumCreateMixin This is album create methods, to
custom method please overwirte any method*/
  openCreateAlbumModal: (selectedObjects: any) => void;
  onDoneAlbum(e: any) {
    this.apiBaseService.post(`media/albums`, { name: e.parents[0].name, description: e.parents[0].description, photos: e.children.map(el => el.id) }).subscribe(res => {
      this.router.navigate(['albums', res.data.uuid]);
    });
  }
  /* ================================== */

  /* AlbumAddMixin This is album add methods, to
custom method please overwirte any method*/
  openModalAddToAlbum: (selectedObjects: any) => void;
  onAddToAlbum(e: any) {
    this.apiBaseService
      .post(`media/albums/${e.parents[0].id}/photos`, {
        photos: e.children
      })
      .subscribe(res => {
        this.toastsService.success('You just added to Album success');
      });
  }
  onAddedToAlbum: (data: any) => void;
  /* ================================== */

  private checkFavoriteAll(objects: Array<any>): boolean {
    let result = true;
    objects.forEach(object => {
      if (object.favorite === false) {
        result = false;
      }
    });
    return result;
  }
}
