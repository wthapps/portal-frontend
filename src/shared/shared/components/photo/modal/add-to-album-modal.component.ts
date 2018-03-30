import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';
import { ApiBaseService } from '../../../../services/apibase.service';
import { Constants } from '../../../../constant/config/constants';
import { WthAppsBaseModal } from '../../../interfaces/wthapps-base-modal';


declare var $: any;
declare var _: any;

@Component({
    selector: 'add-to-album-modal',
  templateUrl: 'add-to-album-modal.component.html',
})
export class AddToAlbumModalComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;

  @Input() selectedPhotos: any;
  @Input() editAlbum: any;

  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  dataAlbums: any = [];
  nextLink: string = null;
  showToast: boolean = false;

  selectedAlbum: any;

  readonly urls = Constants.urls;

  constructor(private apiBaseService: ApiBaseService) {
  }

  ngOnInit() {
    // Only get data when user clicked add to album
    // this.getAlbum();
  }

  open(options: any) {
    this.getAlbum();
    this.selectedPhotos = options.selectedObjects;
    this.modal.open(options).then();
  }

  close(options?: any) {
    this.modal.close();
  }

  getAlbum() {
    this.apiBaseService.get('media/albums').subscribe((res: any)=> {
      this.dataAlbums = res.data;
      this.nextLink = res.page_metadata.links.next;
    });
  }

  onLoadMore(event: any) {
    event.preventDefault();
    this.apiBaseService.get(this.nextLink).subscribe((res: any)=> {
      _.map(res.data, (v: any)=> {
        this.dataAlbums.push(v);
      });
      this.nextLink = res.page_metadata.links.next;
    });
  }

  addToAlbum(album: any, index: number) {
    this.selectedAlbum = album;
    let body = JSON.stringify({
      photos: _.map(this.selectedPhotos, 'id')
    });
    console.log(album, body);
    this.apiBaseService.post(`media/albums/${album.id}/photos`, body).subscribe((res: any)=> {
      this.dataAlbums[index].photo_number = res.data.length;
      this.modal.close();
      this.showToast = true;
    });
  }

  onAction(options: any) {
    this.event.emit(options);
  }

  onCreateNewAlbum() {
    this.onAction({action: 'openModal', payload: {modalName: 'createAlbumModal', data: this.selectedPhotos}});
  }

}
