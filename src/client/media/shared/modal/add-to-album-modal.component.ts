import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';

import { ZMediaAlbumService } from '../../album/album.service';
import { Constants } from '../../../core/shared/config/constants';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'add-to-album-modal',
  templateUrl: 'add-to-album-modal.component.html',
})
export class AddToAlbumModalComponent implements BaseMediaModal, OnInit {
  @ViewChild('modal') modal: ModalComponent;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  @Input() selectedPhotos: any;
  @Input() editAlbum: any;

  dataAlbums: any = [];
  nextLink: string = null;
  showToast: boolean = false;

  selectedAlbum: any;

  readonly urls = Constants.urls;

  constructor(private albumService: ZMediaAlbumService) {
  }

  ngOnInit() {
    // Only get data when user clicked add to album
    // this.getAlbum();
  }

  open(options: any) {
    this.getAlbum();
    this.selectedPhotos = options.selectedObjects;
    console.debug('selectedPhotos: ', this.selectedPhotos);
    this.modal.open(options).then((res: any) => console.log('form add to album: open modal ', res));
  }

  close() {

  }

  getAlbum() {
    this.albumService.listAlbum().subscribe(
      (res: any)=> {
        this.dataAlbums = res.data;
        this.nextLink = res.page_metadata.links.next;
      }
    );
  }

  onLoadMore(event: any) {
    event.preventDefault();
    this.albumService.loadMore(this.nextLink).subscribe((res: any)=> {
      _.map(res.data, (v: any)=> {
        this.dataAlbums.push(v);
      });
      this.nextLink = res.page_metadata.links.next;
    });
  }

  addToAlbum(album: any, index: number) {
    this.selectedAlbum = album;
    this.albumService.addToAlbum(album.id, this.selectedPhotos).subscribe(
      (res: any)=> {
        console.log(res);
        this.dataAlbums[index].photo_number = res.data.length;
        this.modal.close();
        this.showToast = true;
      }
    );
  }

  onAction(options: any) {
    this.event.emit(options);
  }

  onCreateNewAlbum() {
    this.onAction({action: 'createAlbum', data: this.selectedPhotos})
  }
  // onCreateNewAlbum() {
  //   this.modal.close();
  //
  //   setTimeout(() => {
  //     this.editAlbum.modal.open();
  //   }, 800);
  //
  // }
}
