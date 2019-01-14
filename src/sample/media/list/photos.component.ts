import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { WDataViewComponent } from '../../shared/w-dataView/w-dataView.component';
import { MPhotosService } from '../shared/services/photos.service';
import { Observable } from 'rxjs';
import { MMediaService } from '../shared/media.service';
import { Constants } from '@shared/constant';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';

declare let _: any;

@Component({
  selector: 'm-photos',
  templateUrl: 'layout.component.html',
  styleUrls: ['layout.component.scss']
})
export class MPhotosComponent implements OnInit {
  @HostBinding('class') class = 'main-page-body';
  @ViewChild('dataView') dataView: WDataViewComponent;

  tooltip: any = Constants.tooltip;
  data$: Observable<any>;
  next: string;

  menuActions = [
    {
      icon: 'fa fa-eye',
      text: this.tooltip.preview,
      action: 'view'
    },
    {
      icon: 'fa fa-share-alt',
      text: this.tooltip.share,
      action: 'share'
    },
    {
      icon: 'fa fa-star-o',
      text: this.tooltip.favourite,
      action: 'favorite'
    },
    {
      icon: 'fa fa-trash-o',
      text: this.tooltip.delete,
      action: 'delete'
    }
  ];

  otherActions = [
    {
      icon: 'fa fa-eye',
      text: 'Add to Album',
      action: 'add_to_album'
    },
    {
      icon: 'fa fa-pencil',
      text: 'Edit information',
      action: 'edit'
    },
    {
      icon: 'fa fa-download',
      text: 'Download',
      action: 'download'
    }
  ];

  constructor(public mediaService: MMediaService,
              private dataService: MPhotosService,
              private confirmService: WthConfirmService) {
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
    }
  }

  onSelectCompleted() {
    this.updateMenuFavorite(_.every(this.dataView.selectedDocuments, 'favorite'));
  }

  async onToggleFavorite() {
    const data = await this.dataService.toggleFavorite(this.dataView.selectedDocuments).toPromise();
    this.updateMenuFavorite(_.every(data.data, 'favorite'));
  }

  async onDelete() {
    await this.dataService.delete(this.dataView.selectedDocuments).toPromise();
  }

  private updateMenuFavorite(isFavorite: boolean) {
    const menuActionsIndex = this.menuActions.findIndex(x => x.action === 'favorite');
    this.menuActions[menuActionsIndex].icon = isFavorite ? 'fa fa-star' : 'fa fa-star-o';
  }
}
