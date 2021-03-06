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
import { Mixins } from '@shared/design-patterns/decorator/mixin-decorator';
import { Router } from '@angular/router';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import { WUploader } from '@shared/services/w-uploader';
import { Subject } from 'rxjs';
import { takeUntil, take, filter } from 'rxjs/operators';
import { MediaAddModalService } from '@shared/modules/photo/components/modal/media/media-add-modal.service';
import { MediaCreateModalService } from '@shared/modules/photo/components/modal/media/media-create-modal.service';
import { MediaViewMixin, AlbumAddMixin, AlbumCreateMixin } from '@shared/modules/photo/mixins';
import { PlaylistCreateMixin } from '@shared/modules/photo/mixins/playlist/playlist-create.mixin';

@Mixins([MediaViewMixin, AlbumAddMixin, AlbumCreateMixin, PlaylistCreateMixin])
@Component({
  selector: 'w-toolbar',
  exportAs: 'wToolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WToolbarComponent implements OnInit, OnDestroy, MediaViewMixin,
  AlbumAddMixin,
  AlbumCreateMixin {
  @Input() leftActionsTemplate: TemplateRef<any>;
  @Input() leftAddActionsTemplate: TemplateRef<any>;
  @Input() objectActionsTemplate: TemplateRef<any>;
  @Input() moreActionsTemplate: TemplateRef<any>;

  @Input() object; // detail object
  @Input() selectedObjects: Array<any> = new Array<any>();
  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  readonly viewModes: any = {
    grid: 'grid',
    list: 'list',
    timeline: 'timeline'
  };
  @Input() viewMode: any = this.viewModes.grid;
  favoriteAll = false;
  hasOneObject = false;
  hasManyObjects = false;
  hasNoObject = false;
  subCreateAlbum: any;
  subAddAlbum: any;
  subOpenCreateAlbum: any;
  subUploader: any;
  readonly tooltip: any = Constants.tooltip;
  subCreatePlaylist: any;

  uppy: any;
  destroy$ = new Subject();

  constructor(
    public apiBaseService: ApiBaseService,
    public resolver: ComponentFactoryResolver,
    public toastsService: ToastsService,
    public router: Router,
    public mediaAddModalService: MediaAddModalService,
    public mediaCreateModalService: MediaCreateModalService,
    public mediaUploaderDataService: MediaUploaderDataService,
    public commonEventService: CommonEventService,
    private uploader: WUploader
  ) {

  }

  ngOnInit() {
    this.subUploader = this.mediaUploaderDataService.action$.subscribe(e => {
      switch (e.action) {
        case 'openModal':
          if (e.payload.modalName === 'createAlbumModal') {
            this.openCreateAlbumModal(e.payload.selectedObjects);
          }
          if (e.payload.modalName === 'addToAlbumModal') {
            this.openModalAddToAlbum(e.payload.selectedObjects);
          }
          break;
      }
    });
  }

  ngOnDestroy() {
    if (this.subUploader) { this.subUploader.unsubscribe(); }
    this.destroy$.next();
    this.destroy$.complete();
  }

  upload(content_types: any = []) {
    this.uploader.open('FileInput', '.w-uploader-file-input-container', {
      allowedFileTypes: content_types,
      video: true
    });
    this.uploader.event$.pipe(filter(e => e.action === 'complete'), take(1)).subscribe(res => {
      this.commonEventService.broadcast(
        { channel: 'ZMediaPhotoListComponent', action: 'reLoadObjects' }
      );
    });
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

  errorHandler(error: any) {
    if (error.statusCode === 406 && error.error === 'Not Acceptable') {
      this.commonEventService.broadcast({ channel: 'LockMessage', payload: error.files });
    }
  }

  changeViewMode(mode: any) {
    this.event.emit({ action: 'changeView', payload: mode });
  }

  /* AlbumCreateMixin This is album create methods, to
custom method please overwirte any method*/
  openCreateAlbumModal: (selectedObjects: any) => void;
  onDoneAlbum: (e: any) => void;
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
