import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/map';

import { Photo } from '../../../models/photo.model';
import { PhotoService } from '../../../services/photo.service';
import { LoadingService } from '../../loading/loading.service';
import { ZMediaSharingService } from '../modal/sharing/sharing.service';
import { WthConfirmService } from '../../confirmation/wth-confirm.service';

declare let _: any;
declare let saveAs: any;

@Component({
  moduleId: module.id,
  selector: 'base-photo-detail',
  template: `<div>base photo details</div>`,
  entryComponents: []
})

export class BasePhotoDetailComponent implements OnInit, OnDestroy {

  module: string = 'media';
  photo: Photo;
  id: number;
  ids: Array<number> = [];
  post_uuid: any;
  prevUrl: string;
  loading: boolean;
  mode: number;
  showDetail: boolean;
  recipients: Array<any> = [];

  // private routeSub: any;
  private destroySubject: Subject<any> = new Subject<any>();


  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    // Back to prevUrl after pressing ESC key
    if (ev.which === 27) this.goBack();
  }

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected wthConfirmService: WthConfirmService,
              protected loadingService: LoadingService,
              protected photoService: PhotoService,
              protected sharingService?: ZMediaSharingService
  ) {
    // this.router = router;
    // this.route = route;
    // this.photoService = photoService;
  }

  ngOnInit() {
    this.route.params
      .takeUntil(this.destroySubject.asObservable())
      .map((params: any) => {
        console.debug('base-photo-detail route params: ', params);
        this.id = +params['id'];
        this.prevUrl = params['prevUrl'];
        if(params['ids']) {
          this.ids = params['ids'].split(',').map(Number) || [];
        }
        if(params['post_uuid'])
          this.post_uuid = params['post_uuid'];
        this.module = params['module'] || this.module;
        this.mode = params['mode'] || 0;
        this.showDetail = params['showDetail'] || false;
        // this.loadItem(this.id);
        return params['id'];
      })
      .switchMap((id: any ) => {
        this.loading = true;
        return this.photoService.getPhoto(id);
      })
      .subscribe((response: any) => {
          this.photo = response.data;
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          console.error('Error when loading photo ', error);
        });
  }

  doEvent(payload: any) {
    switch (payload.action) {
      case 'goBack':
        this.goBack();
        // this.router.navigateByUrl(this.prevUrl);
        break;
      case 'changeMode':
        this.mode = 1; // editable mode
        break;
      case 'loadItem':
        const tree: UrlTree = this.router.parseUrl(this.router.url);
        if(tree.root.children.modal)
          tree.root.children.modal.segments[1].path = payload.id;
        else
          tree.root.children.primary.segments[1].path = payload.id;
        this.router.navigateByUrl(tree);
        break;
      // case 'confirmUpdate':
      //   this.confirmUpdate(payload);
      //
      //   break;
      case 'photoUpdated':
        this.refreshUpdatedPhoto(payload.payload);
        break;
      case 'favourite':
        this.favourite();
        break;
      case 'download':
        this.photoService.download({id: this.photo.id}).subscribe(
          (response: any) => {
            var blob = new Blob([response.blob()], {type: this.photo.content_type});
            saveAs(blob, this.photo.name);
          },
          (error: any) => {
            console.log(error);
          }
        );
        break;
      case 'confirmDelete':
        console.debug('base-photo-detail: confirmDelete', payload);
        this.confirmDelete(payload);
        break;
    }
  }

  goBack() {
    this.router.navigate([{outlets: {modal: null}}]);
    this.photoService.closePreviewModal();
  }

  confirmUpdate(payload: any): Promise<any> {
    return this.photoService.confirmUpdate(this.photo, payload)
      .then((data: any) => {
        this.photo = data;
        this.photoService.setModifiedPhotos({action: 'update', payload: {post_uuid: this.post_uuid, photo: this.photo}});
        return this.photo;
      });
  }

  refreshUpdatedPhoto(payload: any) {
    console.debug('refresh Photo: ', payload);
    this.photo = payload;
    this.photoService.setModifiedPhotos({action: 'update', payload: {post_uuid: this.post_uuid, photo: this.photo}});
  }

  refreshDeletedPhoto(payload: any) {

  }

  confirmDelete(payload: any): Promise<any> {
    // Ask for user confirmation before deleting selected PHOTOS
    return new Promise<any>((resolve: any) => {
      this.wthConfirmService.confirm({
        message: `Are you sure to delete photo ${this.photo.name} ?`,
        accept: () => {
          this.loadingService.start();
          let body = JSON.stringify({ids: [this.photo.id]});
          this.photoService.deletePhoto(body).toPromise().then((res: any)=> {

            // considering remove item in ids array and back to preUrl
            // this.router.navigateByUrl(this.prevUrl);
            this.goBack();
            this.photoService.setModifiedPhotos({action: 'delete', payload: {post_uuid: this.post_uuid, photo: this.photo}});

            this.loadingService.stop();
            resolve(this.photo);
          });
        },
        reject: () => {
          // Ask for user confirmation before deleting selected ALBUMS
        }
      });
    });
  }

  // Change image when delete current one: next, prev or go back to photo list
  deleteAndChangeImg() {
    // Remove images at index position
    // this.selectedPhotos.splice(this.index, 1);
    // if (this.selectedPhotos.length == 0)
    //   this.goBack();
    // else
    //   this.imgNext();
  }

  ngOnDestroy() {
    // this.routeSub.unsubscribe();
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  private favourite() {
    this.photoService.actionOneFavourite(this.photo).subscribe((res: any)=> {
      this.photo.favorite = res.data.favorite;
    });
  }


}

