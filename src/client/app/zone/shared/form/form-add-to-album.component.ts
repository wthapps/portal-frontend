import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, ElementRef } from '@angular/core';
import { FormModalComponent } from "../../../shared/form/form-modal.component";
import { LoadingService } from "../../../partials/loading/loading.service";
import { AlbumService } from "../../../shared/services/picture/album.service";
import { Album } from "../../../shared/models/album.model";
import { Photo } from "../../../shared/models/photo.model";
import { AlbumPhoto } from "../../../shared/models/album-photos.model";
import { FormManagerService } from "../../../shared/form/form-manager.service";

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-form-add-to-album',
  templateUrl: 'form-add-to-album.component.html',
})
export class ZPictureFormAddToAlbumComponent extends FormModalComponent {
  @Input() selectedItems: Array<Photo>;
  @Output() createNewAlbum: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() doneFormModal: EventEmitter<any> = new EventEmitter<any>();

  dataAlbums: Array<Album> = [];

  constructor(private loadingService: LoadingService,
              private albumService: AlbumService,
              private formManagerService: FormManagerService,) {
    super('form-add-to-album-modal');
  }

  ngOnInit() {
    super.ngOnInit();
    this.getAlbum();
  }

  getAlbum(page: number = 1) {
    this.loadingService.start('#album-data-loading');
    this.albumService.get(this.albumService.url + '?', {page: page}).subscribe(
      (response: any) => {
        this.dataAlbums = _.concat(this.dataAlbums, response.data);
        this.loadingService.stop('#album-data-loading');
        if (this.dataAlbums.length < response.total) {
          this.getAlbum(page + 1);
        }
      },
      error => {
        this.loadingService.stop('#album-data-loading');
      }
    );
  }

  addToAlbum(album: any) {
    let arrPhotos = [];
    for (let items of this.selectedItems) {
      arrPhotos.push(items.id);
    }
    this.albumService.post(this.albumService.url + album.id + '/photos', {photos: arrPhotos})
      .subscribe(
        res => {
          let albumPhotos = new AlbumPhoto({album: album, photos: arrPhotos});
          this.doneFormModal.emit(albumPhotos);
          this.dataAlbums = [];
          this.getAlbum();
        }
      )
  }

  //
  onCreateNewAlbum() {
    this.createNewAlbum.emit(true);
  }
}
