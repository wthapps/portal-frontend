import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ZMediaAlbumService } from './album.service';

@Component({
  moduleId: module.id,
  selector: 'z-media-album-detail',
  templateUrl: 'album-detail.component.html',
  styleUrls: ['album-detail.component.css']
})
export class ZMediaAlbumDetailComponent implements OnInit {

  album: any;
  params: any;
  showDetail: boolean;

  constructor(
    private route: ActivatedRoute,
    private albumService: ZMediaAlbumService) {
  }

  ngOnInit() {

    this.route.params
      .switchMap((params: Params) => {
        this.params = params;
        this.showDetail = params['showDetail'] || false;
        return this.albumService.getAlbum(params['id']); })
        .subscribe((res: any)=> {
          this.album = res.data;
      });
  }
}
