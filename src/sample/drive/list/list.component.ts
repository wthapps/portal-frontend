import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';

import { Constants } from '@shared/constant';

import { NoteService } from '../shared/note.service';
import { WDataViewComponent } from '@shared/components/w-dataView/w-dataView.component';

@Component({
  selector: 'n-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class NNoteListComponent implements OnInit {
  @HostBinding('class') class = 'main-page-body';

  @ViewChild('dataView') dataView: WDataViewComponent;

  tooltip: any = Constants.tooltip;
  data$: Observable<any>;
  next: string;
  menuActions = [
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
      icon: 'fa fa-pencil',
      text: 'Edit',
      action: 'edit'
    },
    {
      active: true,
      icon: 'fa fa-download',
      text: 'Move to folder',
      action: 'move_to_folder'
    }
  ];

  constructor(private dataService: NoteService) {
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
    console.log(event);
    const data = await this.dataService.sort(event).toPromise();
    this.next = data.meta.links.next;
  }

  onViewComplete(event: any) {
    this.dataView.viewMode = event;
    // this.dataView.container.ngOnDestroy();
    this.dataView.container.update();
    // this.dataView.updateSelect();
  }

  onSelectCompleted() {

    // update icon favorite
    this.updateMenuFavorite(_.every(this.dataView.selectedDocuments, 'favorite'));

    // check menu view
    const otherActionsEdit = _.find(this.otherActions, ['action', 'edit']);
    otherActionsEdit.active = !(this.dataView.selectedDocuments.length > 1);
  }

  private updateMenuFavorite(isFavorite: boolean) {
    const menuActionsIndex = this.menuActions.findIndex(x => x.action === 'favorite');
    this.menuActions[menuActionsIndex].icon = isFavorite ? 'fa fa-star' : 'fa fa-star-o';
  }
}
