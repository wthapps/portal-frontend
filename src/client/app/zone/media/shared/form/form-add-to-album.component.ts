import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ZMediaAlbumService } from '../../album/album.service';
import { HdModalComponent } from '../../../shared/ng2-hd/modal/components/modal';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-share-form-add-to-album',
  templateUrl: 'form-add-to-album.component.html',
})
export class ZMediaFormAddToAlbumComponent implements OnInit {
  @ViewChild('modal') modal: HdModalComponent;

  @Input() selectedPhotos: any;
  @Input() editAlbum: any;

  dataAlbums: any = [];
  nextLink: string = null;
  showToast: boolean = false;

  selectedAlbum: any;

  constructor(private albumService: ZMediaAlbumService) {
  }

  ngOnInit() {
    // Only get data when user clicked add to album
    // this.getAlbum();
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
        this.dataAlbums[index].photo_number = res.data.length;
        this.modal.close();
        this.showToast = true;
      }
    );
  }

  onCreateNewAlbum() {
    this.modal.close();

    setTimeout(() => {
      this.editAlbum.modal.open();
    }, 800);

  }
}
