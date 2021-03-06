// import {
//   Component,
//   Output,
//   OnInit,
//   AfterViewInit,
//   OnChanges,
//   EventEmitter,
//   SimpleChanges,
//   ViewChild,
//   ElementRef, OnDestroy
// } from '@angular/core';
// import { Router } from '@angular/router';
// import { take } from 'rxjs/operators';

// import { MediaUploaderDataService } from './media-uploader-data.service';
// import { ModalDockComponent } from '@wth/shared/shared/components/modal/dock.component';
// import { ApiBaseService } from '@wth/shared/services';
// import { CommonEventService } from '@shared/services/common-event/common-event.service';
// import { PlaylistCreateModalService } from '@shared/shared/components/photo/modal/playlist/playlist-create-modal.service';
// import { PlaylistModalService } from '@shared/shared/components/photo/modal/playlist/playlist-modal.service';
// import { Subscription, Subject } from 'rxjs';
// import { WUploader } from '@shared/services/w-uploader';
// import { ModalService } from '@shared/components/modal/modal-service';
// import { PlaylistAddMixin } from '@shared/mixin/playlist/playlist-add.mixin';
// import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
// import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
// import { MediaAddModalService } from '@shared/shared/components/photo/modal/media/media-add-modal.service';
// import { Mixins } from '@shared/design-patterns/decorator/mixin-decorator';
// import { AlbumAddMixin } from '@shared/mixin/album/album-add.mixin';

// declare var $: any;
// declare var _: any;

// @Component({
//   moduleId: module.id,
//   selector: 'me-uploader',
//   templateUrl: 'media-uploader.component.html',
//   styleUrls: ['media-uploader.component.scss'],
// })
// @Mixins([PlaylistAddMixin, AlbumAddMixin])
// export class MediaUploaderComponent implements OnInit, AfterViewInit, OnDestroy, PlaylistAddMixin, AlbumAddMixin {
//   current_photo: any;
//   step: number;
//   files_num: number;
//   uploaded_num: number;
//   stopped_num: number;
//   pending_files: Array<any> = [];
//   pending_request: Subscription;
//   photos: Array<any> = [];
//   files: Array<any>;
//   isVideos: any;
//   readonly uploadSteps: any = {
//     closed: -1,
//     begin: 0,
//     init: 1,
//     uploaded: 2,
//     error: 3,
//     stop: 4,
//   };
//   // events: Subject<any>;

//   current_file: any;
//   current_progress: any;
//   uploadURL: any;
//   subAddPlaylist: any;
//   subOpenCreatePlaylist: any;
//   subCreatePlaylist: any;
//   destroy$ = new Subject();

//   @Output() createNewAlbum: EventEmitter<any> = new EventEmitter<any>();
//   @Output() addToAlbum: EventEmitter<any> = new EventEmitter<any>();

//   @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

//   @ViewChild('modalDock') modalDock: ModalDockComponent;
//   private uploaderSub: any;
//   subAddAlbum: Subscription;
//   subOpenCreateAlbum: Subscription;
//   subCreateAlbum: Subscription;

//   constructor(public apiBaseService: ApiBaseService,
//               private commonEventService: CommonEventService,
//               private playlistCreateModalService: PlaylistCreateModalService,
//               private playlistModalService: PlaylistModalService,
//               private mediaUploadDataService: MediaUploaderDataService,
//               public mediaAddModalService: MediaAddModalService,
//               public mediaCreateModalService: MediaCreateModalService,
//               public toastsService: ToastsService,
//               public router: Router,
//               private uploader: WUploader,
//               private modalService: ModalService) {
//     this.dragleave();
//   }

//   openModalAddToPlaylist:(selectedObjects: any) => void;
//   onAddToPlaylist:(e: any) => void;
//   openCreatePlaylistModal:(selectedObjects: any) => void;
//   onDonePlaylist:(e: any) => void;
//   onAddedToPlaylist:(data: any) => void;
//   openModalAddToAlbum:(selectedObjects: any) => void;
//   onAddToAlbum:(e: any) => void;
//   openCreateAlbumModal:(selectedObjects: any) => void;
//   onDoneAlbum:(e: any) => void;
//   onAddedToAlbum:(data: any) => void;

//   ngOnInit() {
//     this.step = this.uploadSteps.begin;
//     this.files = new Array<any>();

//     this.uploaderSub = this.uploader.event$.subscribe(event => {
//       this.updateUploadStatus(event);
//     });
//   }

//   ngOnDestroy() {
//     this.uploaderSub.unsubscribe();
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   ngAfterViewInit() {
//     const _thisPicture = this;
//     $('body').bind('dragover', _thisPicture.dragover);

//   }

//   close() {
//     if (this.step === this.uploadSteps.uploaded || this.step === this.uploadSteps.stop) {
//       this.outEvent.emit({
//         action: 'addPhoto',
//         data: this.photos
//       });
//     }
//     this.step = this.uploadSteps.closed;
//     this.uploaderSub.unsubscribe();
//   }

//   stop(event: any) {
//     event.preventDefault();
//     this.uploader.cancelAll();
//     if (this.pending_request && !this.pending_request.closed) {
//       this.pending_request.unsubscribe();
//     }
//     this.stopped_num = this.files_num - this.uploaded_num;
//     this.step = this.uploadSteps.stop;
//   }

//   // Retry upload pending files
//   retryUpload(event: any) {
//     event.preventDefault();
//     if (this.pending_files[0].type.includes('video/')) {
//       this.pending_files.forEach(f => {
//         this.apiBaseService.post(`media/videos`, f).subscribe(res => {
//         });
//       });
//     } else {
//       this.pending_files.forEach(f => {
//         this.apiBaseService.post(`media/photos`, f).subscribe(res => {
//         });
//       });
//     }
//   }

//   onAction(options?: any): void {
//     // close uploading form
//     if ( _.get(options, 'action') !== 'updateMediaList') {
//       this.step = this.uploadSteps.closed;
//       this.modalDock.close();
//     }

//     // this.outEvent.emit(options);
//     this.mediaUploadDataService.onAction(options);
//   }

//   createAlbum() {
//     this.modalService.open({modalName: 'createAlbumModal', selectedObjects: this.photos});
//   }

//   addAlbum() {
//     this.openModalAddToAlbum(this.photos);
//   }

//   createPlaylist() {
//     this.openCreatePlaylistModal(this.photos);
//   }

//   addPlaylist() {
//     this.openModalAddToPlaylist(this.photos);
//   }

//   // onCreateNewAlbum() {
//   //   this.createNewAlbum.emit(this.photos);
//   // }

//   onDrop(event: any) {
//     // Code does not work
//     // $('body').removeClass('drag-active');
//     // event.stopPropagation();
//     // event.preventDefault();
//     // this.files = event.dataTransfer.files;
//     // if (this.files.length == 0) return;
//     // this.uploadImages(this.files);
//   }

//   dragleave() {
//     $('body').removeClass('drag-active');
//   }

//   dragover(event: any) {
//     $('body').addClass('drag-active');
//     event.preventDefault();
//   }

//   dragenter() {
//     $('body').addClass('drag-active');
//   }

//   updateUploadStatus(event) {
//     console.log(event);

//     switch (event.action) {
//       case 'start':
//         this.photos = [];
//         this.step = 1;
//         this.uploaded_num = 0;
//         this.files_num = event.payload.fileIDs.length;
//         this.modalDock.open();
//         break;
//       case 'progress':
//         this.current_file = event.payload.file;
//         this.current_progress = event.payload.progress;
//         this.uploadURL = event.payload.file.preview;
//         break;
//       case 'success':
//         const object = event.payload.resp;
//         this.uploaded_num++;
//         this.photos.push(object);
//         this.uploadURL = object.thumbnail_url;
//         this.isVideos = object.content_type.startsWith('video') ? true : false;
//         break;
//       case 'error':
//         // this.step = 3;
//         break;
//       case 'cancel-success':
//       case 'complete':
//         if (this.uploaded_num > 0) {
//           this.commonEventService.broadcast({ channel: 'WUploaderStatus', action: 'updateMediaList', payload: { } });
//           this.step = 2;
//         }
//         break;
//     }
//   }

//   hasSuccessful() {
//     return this.photos.length > 0 ? true : false;
//   }
// }
