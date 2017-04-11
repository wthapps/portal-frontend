import { Component, Input, OnInit } from '@angular/core';

import { Photo } from '../../../core/shared/models/photo.model';
import { ZMediaPhotoService } from '../photo.service';
import { ActivatedRoute, Params } from '@angular/router';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-photo-edit',
  templateUrl: 'edit-photo.component.html'
})
export class ZMediaPhotoEditComponent implements OnInit {
  @Input() data: Photo = null;

  loadingImg: boolean = true;

  constructor(private photoService: ZMediaPhotoService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.getPhoto(params['id']);
    });
  }

  getPhoto(id: any) {
    this.photoService.getPhoto(id).subscribe(
      (res: any)=> {
        this.data = res.data;
      }
    );
  }

  showLoading() {
    this.loadingImg = false;
  }
}
