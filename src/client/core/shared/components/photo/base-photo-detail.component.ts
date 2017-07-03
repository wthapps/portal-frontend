import {
  Component, OnDestroy, OnInit
} from '@angular/core';
import { ActivatedRoute, Route, Router, UrlTree } from '@angular/router';
import { Photo } from '../../models/photo.model';
import { PhotoService } from "../../services/photo.service";

@Component({
  moduleId: module.id,
  selector: 'base-photo-detail',
  templateUrl: `<div>base photo details</div>`,
  entryComponents: [
  ]
})

export class BasePhotoDetailComponent implements OnInit, OnDestroy {

  module: string = 'media';
  photo: Photo;
  id: number;
  ids: Array<number>;
  prevUrl: string;
  loading: boolean;
  mode: number;
  private routeSub: any;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected photoService: PhotoService) {
    this.router = router;
    this.route = route;
    this.photoService = photoService;

  }

  ngOnInit() {
    this.routeSub = this.route.params
      .subscribe((params: any) => {
        this.id = params['id'];
        this.prevUrl = params['prevUrl'];
        this.ids = params['ids'].split(',').map(Number) || [];
        this.module = params['module'] || this.module;
        this.mode = params['mode'] || 0;
        this.loadItem(this.id);
      });
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
        tree.root.children.primary.segments[1].path = payload.id;
        this.router.navigateByUrl(tree);
        break;
      case 'updatePhoto':
        this.photoService.create({
          name: this.photo.name + `.${this.photo.extension}`,
          type: this.photo.content_type,
          file: payload.editedData
        }).subscribe((res:any) => {
        });
        break;
    }
  }

  loadItem(id: number) {
    this.loading = true;
    return this.photoService.getPhoto(id)
      .subscribe((response: any) => {
          this.photo = response.data;
          this.loading = false;
        },
        (error: any) => {
          console.error('Error when loading photo ', error);
        });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

}
