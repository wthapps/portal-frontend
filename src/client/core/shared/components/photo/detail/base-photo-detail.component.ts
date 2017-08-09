import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { Photo } from '../../../models/photo.model';
import { PhotoService } from '../../../services/photo.service';
import { ConfirmationService } from 'primeng/primeng';
import { LoadingService } from '../../loading/loading.service';
import { ZMediaSharingService } from '../modal/sharing/sharing.service';

declare let _: any;
declare let saveAs: any;

@Component({
  moduleId: module.id,
  selector: 'base-photo-detail',
  templateUrl: `<div>base photo details</div>`,
  entryComponents: []
})

export class BasePhotoDetailComponent implements OnInit, OnDestroy {

  module: string = 'media';
  photo: Photo;
  id: number;
  ids: Array<number>;
  prevUrl: string;
  loading: boolean;
  mode: number;
  showDetail: boolean;
  recipients: Array<any> = [];

  private routeSub: any;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    // Back to prevUrl after pressing ESC key
    if (ev.which === 27) this.router.navigateByUrl(this.prevUrl);
  }

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected confirmationService: ConfirmationService,
              protected loadingService: LoadingService,
              protected photoService: PhotoService,
              protected sharingService?: ZMediaSharingService
  ) {
    this.router = router;
    this.route = route;
    this.photoService = photoService;
  }

  ngOnInit() {
    this.routeSub = this.route.params
      .map((params: any) => {
        this.id = +params['id'];
        this.prevUrl = params['prevUrl'];
        if(params['ids']) {
          this.ids = params['ids'].split(',').map(Number) || [];
        }
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
          console.error('Error when loading photo ', error);
        });

    ;
  }

  doEvent(payload: any) {
    switch (payload.action) {
      case 'goBack':
        this.router.navigateByUrl(this.prevUrl);
        break;
      case 'changeMode':
        this.mode = 1; // editable mode
        break;
      case 'loadItem':
        const tree: UrlTree = this.router.parseUrl(this.router.url);
        tree.root.children.modal.segments[1].path = payload.id;
        this.router.navigateByUrl(tree);
        break;
      case 'update':
        this.confirmationService.confirm({
          message: 'Are you sure to save the photo?\nThis photo will replace current photo!',
          header: 'Save Photo',
          accept: () => {
            this.photoService.update({
              id: this.photo.id,
              name: this.photo.name + `.${this.photo.extension}`,
              type: this.photo.content_type,
              file: payload.editedData
            }).subscribe((response: any) => {
              this.photo = response.data;
            });
          }
        });

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
      case 'delete':

        // Ask for user confirmation before deleting selected PHOTOS
        this.confirmationService.confirm({
          message: `Are you sure to delete photo ${this.photo.name}`,
          accept: () => {
            this.loadingService.start();
            let body = JSON.stringify({ids: [this.photo.id]});
            this.loadingService.start();
            this.photoService.deletePhoto(body).subscribe((res: any)=> {

              // considering remove item in ids array and back to preUrl
              this.router.navigateByUrl(this.prevUrl);
              // _.remove(this.ids, ['id', this.photo.id]);
              this.loadingService.stop();
            });
          },
          reject: () => {
            // Ask for user confirmation before deleting selected ALBUMS
          }
        });

        break;


    }
  }

  // confirmDeleteMedia(params: any) {
  //   // Ask for user confirmation before delete media items
  //   let photos = _.filter(params.selectedObjects, (o: any) => o.object_type == 'photo');
  //   let albums = _.filter(params.selectedObjects, (o: any) => o.object_type == 'album');
  //   let photos_count = photos.length  + (photos.length > 1 ? ' photos?' : ' photo?');
  //
  //   if( photos.length > 0 ) {
  //     // Ask for user confirmation before deleting selected PHOTOS
  //     this.confirmationService.confirm({
  //       message: 'Are you sure to delete ' + photos_count,
  //       accept: () => {
  //         this.loadingService.start();
  //         this.apiBaseService.post('media/media/delete', {objects: photos, child_destroy: params.child_destroy}).subscribe(
  //           (res: any) => {
  //             _.map(photos, (obj: any)=> {
  //               _.remove(this.objects, {'id': obj.id, 'object_type': obj.object_type});
  //             });
  //             this.loadingService.stop();
  //             this.deleteAndChangeImg();
  //           },
  //           (error: any) => this.loadingService.stop());
  //       },
  //       reject: () => {
  //         // Ask for user confirmation before deleting selected ALBUMS
  //       }
  //     });
  //   }
  // }

  private favourite() {
    this.photoService.actionOneFavourite(this.photo).subscribe((res: any)=> {
      this.photo.favorite = res.data.favorite;
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

  loadItem(id: number) {
    // this.loading = true;
    // return this.photoService.getPhoto(id)
    //   .then((response: any) => {
    //       this.photo = response.data;
    //       this.loading = false;
    //     },
    //     (error: any) => {
    //       console.error('Error when loading photo ', error);
    //   });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

}
