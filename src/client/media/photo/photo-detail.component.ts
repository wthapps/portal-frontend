import {
  Component, OnDestroy, OnInit
} from '@angular/core';
import { ActivatedRoute, Route, Router, UrlTree } from '@angular/router';
import { PhotoService } from '../../core/shared/services/photo.service';
import { BasePhotoDetailComponent } from '../../core/shared/components/photo/base-photo-detail.component';

@Component({
  moduleId: module.id,
  selector: 'photo-detail',
  templateUrl: 'photo-detail.component.html',
  styleUrls: ['photo-detail.component.css'],
  entryComponents: [
  ]
})

export class PhotoDetailComponent extends BasePhotoDetailComponent {

  // module: string = 'media';
  // photo: Photo;
  // id: number;
  // ids: Array<number>;
  // prevUrl: string;
  // loading: boolean;
  // mode: number;
  // private routeSub: any;

  constructor(protected route: ActivatedRoute, protected router: Router, protected photoService: PhotoService) {
    super(route, router, photoService);
    this.module = 'media';
  }

  // ngOnInit() {
  //   this.ngOnInit();
  //   this.module = 'testing';
  //   // this.routeSub = this.route.params
  //   //   .subscribe((params: any) => {
  //   //     this.id = params['id'];
  //   //     this.prevUrl = params['prevUrl'];
  //   //     this.ids = params['ids'].split(',').map(Number) || [];
  //   //     this.module = params['module'] || 'media';
  //   //     this.mode = params['mode'] || 0;
  //   //     this.loadItem(this.id);
  //   //   });
  // }
  //
  // doEvent(payload: any) {
  //   switch (payload.action) {
  //     case 'goBack':
  //       this.router.navigateByUrl(this.prevUrl);
  //       break;
  //     case 'changeMode':
  //       this.mode = 1; // editable mode
  //       break;
  //     case 'loadItem':
  //       const tree: UrlTree = this.router.parseUrl(this.router.url);
  //       tree.root.children.primary.segments[1].path = payload.id;
  //       this.router.navigateByUrl(tree);
  //       break;
  //     case 'updatePhoto':
  //       this.photoService.create({
  //         name: this.photo.name + `.${this.photo.extension}`,
  //         type: this.photo.content_type,
  //         file: payload.editedData
  //       }).subscribe((res:any) => {
  //          console.log('response: ',  res);
  //       });
  //       break;
  //   }
  // }
  //
  // loadItem(id: number) {
  //   this.loading = true;
  //   return this.photoService.getPhoto(id)
  //     .subscribe((response: any) => {
  //         this.photo = response.data;
  //         this.loading = false;
  //       },
  //       (error: any) => {
  //         console.error('Error when loading photo ', error);
  //       });
  // }
  //
  // ngOnDestroy() {
  //   this.routeSub.unsubscribe();
  // }

}
