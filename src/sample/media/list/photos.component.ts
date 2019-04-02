import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';

import { MessageService } from 'primeng/api';

import { Constants } from '@shared/constant';

import { MMediaService } from '../shared/media.service';
import { MPhotosService } from '../shared/services/photos.service';

import { MAlbumsService } from '../shared/services/albums.service';
import { WDataViewComponent } from '../../shared/components/w-dataView/w-dataView.component';
import { WModalsAddToAlbumComponent } from '../../shared/components/modals/add-to-album/add-to-album.component';
import { WModalsShareComponent } from '../../shared/components/modals/share/share.component';
import { WModalsPhotoEditInfoComponent } from '../../shared/components/modals/photo-edit-info/photo-edit-info.component';

declare let _: any;

@Component({
  selector: 'm-photos',
  templateUrl: 'layout.component.html',
  styleUrls: ['layout.component.scss']
})
export class MPhotosComponent implements OnInit {
  @HostBinding('class') class = 'main-page-body';

  @ViewChild('dataView') dataView: WDataViewComponent;
  @ViewChild('modalAddToAlbum') modalAddToAlbum: WModalsAddToAlbumComponent;
  @ViewChild('modalShare') modalShare: WModalsShareComponent;
  @ViewChild('modalPhotoEditInfo') modalPhotoEditInfo: WModalsPhotoEditInfoComponent;

  tooltip: any = Constants.tooltip;
  data$: Observable<any>;
  next: string;

  menuActions = [
    {
      active: true,
      icon: 'fa fa-eye',
      text: this.tooltip.preview,
      action: 'view'
    },
    {
      active: true,
      icon: 'fa fa-share-alt',
      text: this.tooltip.share,
      action: 'share'
    },
    {
      active: true,
      icon: 'fa fa-star-o',
      text: this.tooltip.favourite,
      action: 'favorite'
    },
    {
      active: true,
      icon: 'fa fa-trash-o',
      text: this.tooltip.delete,
      action: 'delete'
    }
  ];

  otherActions = [
    {
      active: true,
      icon: 'fa fa-eye',
      text: 'Add to Album',
      action: 'add_to_album'
    },
    {
      active: true,
      icon: 'fa fa-pencil',
      text: 'Edit information',
      action: 'edit'
    },
    {
      active: true,
      icon: 'fa fa-download',
      text: 'Download',
      action: 'download'
    }
  ];

  constructor(public mediaService: MMediaService,
              private dataService: MPhotosService,
              private albumsService: MAlbumsService,
              private messageService: MessageService) {
    this.data$ = this.dataService.data$;
  }

  ngOnInit(): void {
    this.getDataAsync().then();
  }

  async getDataAsync() {
    const data = await this.dataService.getData(this.next).toPromise();
    this.next = data.meta.links.next;
  }

  onLoadMoreCompleted(event: any) {
    if (event && this.next) {
      this.getDataAsync().then();
    }
  }

  async onSortComplete(event: any) {
    const data = await this.dataService.sort(event).toPromise();
    this.next = data.meta.links.next;
  }

  onMenuAction(action: string) {
    console.log(action);
    switch (action) {
      case 'favorite':
        this.onToggleFavorite();
        break;
      case 'delete':
        this.onDelete();
        break;
      case 'share':
        this.onShare();
        break;
      case 'add_to_album':
        this.onAddToAlbum();
        break;
      case 'edit':
        this.onEditInfo();
        break;
      case 'download':
        this.onDownload();
        break;
    }
  }

  onSelectCompleted() {

    // update icon favorite
    this.updateMenuFavorite(_.every(this.dataView.selectedDocuments, 'favorite'));

    // check menu view
    const otherActionsEdit = _.find(this.otherActions, ['action', 'edit']);
    otherActionsEdit.active = !(this.dataView.selectedDocuments.length > 1);
  }

  async onAddToAlbum() {
    const data = await this.albumsService.getData().toPromise();
    this.modalAddToAlbum.data = data.data;
    this.modalAddToAlbum.next = data.meta.links.next;

    this.modalAddToAlbum.modal.open();
  }

  async onModalAddCompleted(album: any) {
    await this.albumsService.addToAlbum(album.id, this.dataView.selectedDocuments).toPromise()
      .then(() => this.modalAddToAlbum.modal.close())
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Add To Album',
          detail: 'You just added to Album success'
        });
      });
  }

  onShare() {
    this.modalShare.getRoles('Media');
    this.modalShare.modal.open();
  }

  onEditInfo() {
    this.modalPhotoEditInfo.updateForm(this.dataView.selectedDocuments[0]);
    this.modalPhotoEditInfo.open()
      .pipe(
        take(1),
        switchMap((photo) => this.dataService.update(photo))
      )
      .subscribe();
  }

  async onToggleFavorite() {
    const data = await this.dataService.toggleFavorite(this.dataView.selectedDocuments).toPromise();
    this.updateMenuFavorite(_.every(data.data, 'favorite'));
  }

  async onDelete() {
    await this.dataService.delete(this.dataView.selectedDocuments).toPromise();
  }

  onDownload() {
    this.dataView.selectedDocuments.forEach(async file => {
      const res = await this.dataService.download(file).toPromise();
      const blob = new Blob([res], { type: file.content_type });
      saveAs(blob, file.name + '.' + file.extension);
    });
  }

  private updateMenuFavorite(isFavorite: boolean) {
    const menuActionsIndex = this.menuActions.findIndex(x => x.action === 'favorite');
    this.menuActions[menuActionsIndex].icon = isFavorite ? 'fa fa-star' : 'fa fa-star-o';
  }
}
