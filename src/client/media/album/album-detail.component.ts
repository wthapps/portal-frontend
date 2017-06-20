import { Component, OnInit, HostListener, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ConfirmationService } from 'primeng/components/common/api';

import { LoadingService } from '../../core/partials/loading/loading.service';

import { ZMediaAlbumService } from './album.service';


declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-album-detail',
  templateUrl: 'album-detail.component.html',
  styleUrls: ['album-detail.component.css']
})
export class ZMediaAlbumDetailComponent implements OnInit {
  // @ViewChild('photoDetail') photoDetail: ZMediaPhotoDetailComponent;
  // @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

  albumDetail: any = [];

  data: any = [];
  nextLink: string = null;

  modalComponent: any;
  modal: any;


  selectedAlbums: any = [];

  albumId: number ;
  keyCtrl: boolean = false;
  hasFavourite: boolean = false;
  currentView: string = 'grid';

  photoIsEmpty: boolean = false;

  params: any;
  hasDetails: boolean = true;
  //
  // @HostListener('document:keydown', ['$event'])
  // onKeyDown(ev: KeyboardEvent) {
  //   console.log(ev);
  //   if (ev.keyCode == 17 || ev.keyCode == 18 || ev.keyCode == 91 || ev.keyCode == 93 || ev.ctrlKey) this.keyCtrl = true;
  // }
  //
  // @HostListener('document:keyup', ['$event'])
  // onKeyUp(ev: KeyboardEvent) {
  //   if (ev.keyCode == 17 || ev.keyCode == 18 || ev.keyCode == 91 || ev.keyCode == 93 || ev.ctrlKey) this.keyCtrl = false;
  // }

  constructor(
    protected resolver: ComponentFactoryResolver,
    private route: ActivatedRoute,
    private albumService: ZMediaAlbumService,
    // private photoService: PhotoService,
    // private confirmationService: ConfirmationService,
    private loadingService: LoadingService) {
  }

  ngOnInit() {
    // this.route.params.subscribe((params: Params) => {
    //   this.albumId = params['id'];
    //   this.params = params;
    //   this.getAlbumDetail(this.albumId);
    // });

    this.route.params
      .switchMap((params: Params) => { this.params = params; return this.albumService.getAlbum(params['id']); })
      .take(1)
      .subscribe((res: any)=> {
        this.albumDetail = res.data;
      });

  }
}
