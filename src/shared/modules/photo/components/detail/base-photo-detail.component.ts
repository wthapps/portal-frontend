import { Component, OnDestroy, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil, map, mergeMap } from 'rxjs/operators';
import { PhotoService } from '../../../../services/photo.service';
import { ApiBaseService, UserService, WthConfirmService } from '@wth/shared/services';
import { Photo } from '@shared/shared/models';
import { LoadingService } from '@shared/shared/components/loading/loading.service';
import { SharingService } from '../modal/sharing/sharing.service';

declare let _: any;
declare let saveAs: any;

@Component({
  selector: 'base-photo-detail',
  template: `<div>base photo details</div>`,
  entryComponents: []
})

export class BasePhotoDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  module = 'media';
  photo: Photo;
  id: number;
  ids: Array<number> = [];
  batchQuery: string;
  post_uuid: any;
  prevUrl: string;
  loading: boolean;
  mode: number;
  showDetail: boolean;
  isOwner: boolean;
  recipients: Array<any> = [];
  photos: Array<any> = [];
  links: any;
  albums: Array<any> = [];
  // private routeSub: any;
  returnUrl: string;
  protected destroySubject: Subject<any> = new Subject<any>();


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
    protected userService: UserService,
    protected sharingService?: SharingService,
    protected api?: ApiBaseService
  ) {
    // this.router = router;
    // this.route = route;
    // this.photoService = photoService;
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'photos';
    this.route.params.pipe(
      takeUntil(this.destroySubject.asObservable()),
      map((params: any) => {
        this.id = params['id'];
        this.prevUrl = params['prevUrl'];

        if (params['ids']) {
          this.ids = params['ids'].split(',').map(Number) || [];
        }
        if (params['post_uuid'])
          this.post_uuid = params['post_uuid'];
        this.module = params['module'] || this.module;
        this.mode = params['mode'] || 0;
        this.showDetail = params['showDetail'] || false;
        // this.loadItem(this.id);

        // get batchQuery
        this.batchQuery = params['batchQuery'] || '';
        return params['id'];
      }),
      mergeMap((id: any) => {
        this.loading = true;
        return this.photoService.getPhoto(id);
      }))
      .subscribe((response: any) => {
        this.photo = response.data;
        this.isOwner = (response.data.owner.id === this.userService.getSyncProfile().id);
        this.loading = false;
        //
        //
        // this.api.get(`media/photos/${this.photo.uuid}/albums`).subscribe((res: any) => {
        //   this.albums = res.data;
        //   // this.api.get(`media/photos/${this.photo.id}/sharings`).subscribe((r: any) => {
        //   //   this.albums = this.albums.concat(r.data);
        //   // }, error => {
        //   //
        //   // });
        // }, error => {
        //
        // });

      },
        (error: any) => {
          this.loading = false;
          console.error('Error when loading photo ', error);
        });
  }

  ngAfterViewInit() {
    if (this.batchQuery !== '') {
      this.api.get(this.batchQuery).subscribe(response => {
        this.photos = response.data;
        this.links = response.meta.links;
      });
    }
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
        if (tree.root.children.modal)
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
        this.photoService.download({ id: this.photo.id }).subscribe(
          (response: any) => {
            const blob = new Blob([response], { type: this.photo.content_type });
            saveAs(blob, `${this.photo.name}.${this.photo.extension}`);
          },
          (error: any) => {
            console.log(error);
          }
        );
        break;
      case 'confirmDelete':
        this.confirmDelete(payload);
        break;
    }
  }

  goBack() {
    if (this.router.url.indexOf('modal:photos') > 0) {
      this.router.navigate([{ outlets: { modal: null } }]);
    } else {
      this.router.navigate([this.returnUrl]);
    }
    this.photoService.closePreviewModal();
  }

  confirmUpdate(payload: any): Promise<any> {
    return this.photoService.confirmUpdate(this.photo, payload)
      .then((data: any) => {
        this.photo = data;
        this.photoService.setModifiedPhotos({ action: 'update', payload: { post_uuid: this.post_uuid, photo: this.photo } });
        return this.photo;
      });
  }

  refreshUpdatedPhoto(payload: any) {
    this.photo = payload;
    this.photoService.setModifiedPhotos({ action: 'update', payload: { post_uuid: this.post_uuid, photo: this.photo } });
  }

  refreshDeletedPhoto(payload: any) {

  }

  confirmDelete(payload: any): Promise<any> {
    // Ask for user confirmation before deleting selected PHOTOS
    return new Promise<any>((resolve: any) => {
      this.wthConfirmService.confirm({
        header: 'Delete photo',
        message: `Are you sure to delete photo ${this.photo.name} ?`,
        accept: () => {
          this.loadingService.start();
          const body = JSON.stringify({ ids: [this.photo.id] });
          this.photoService.deletePhoto(body).toPromise().then((res: any) => {

            // considering remove item in ids array and back to preUrl
            // this.router.navigateByUrl(this.prevUrl);
            this.goBack();
            this.photoService.setModifiedPhotos({ action: 'delete', payload: { post_uuid: this.post_uuid, photo: this.photo } });

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
    this.photoService.actionOneFavourite(this.photo).subscribe((res: any) => {
      this.photo.favorite = res.data.favorite;
    });
  }


}

