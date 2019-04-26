import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { WDataViewComponent } from '../../../sample/shared/components/w-dataView/w-dataView.component';
import { Constants } from '@shared/constant';
import { Observable } from 'rxjs';
import { WNoteSelectionService } from '@shared/components/w-note-selection/w-note-selection.service';
import { WTab } from '@shared/components/w-nav-tab/w-nav-tab';
import { BsModalComponent } from 'ng2-bs3-modal';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { Note } from '@shared/shared/models/note.model';

@Component({
  selector: 'w-note-selection',
  templateUrl: 'w-note-selection.component.html',
  styleUrls: ['w-note-selection.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WNoteSelectionComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;
  @ViewChild('dataView') dataView: WDataViewComponent;
  tooltip: any = Constants.tooltip;
  data$: Observable<any>;
  next: string;

  title: string;
  breadcrumb: Note[];
  searchShow: boolean;
  tabs: WTab[] = [
    {
      name: 'My Note',
      link: 'my_note',
      icon: 'icon-zone-note',
      number: null,
      type: 'tab'
    },
    {
      name: 'Favourites',
      link: 'favourites',
      icon: 'fa fa-star',
      number: null,
      type: 'tab'
    },
    {
      name: 'Shared with me',
      link: 'shared_with_me',
      icon: 'fw fw-shared-with-me',
      number: null,
      type: 'tab'
    }
  ];
  currentTab = 'my_note'; // my_note, favourites, shared_with_me
  constructor(private dataService: WNoteSelectionService) {
    this.data$ = this.dataService.data$;
    this.updateTitle();
  }

  ngOnInit(): void {
    this.dataService.open$
      .pipe(takeUntil(componentDestroyed(this)))
      .subscribe((res: any) => {
        console.log(res);
        if (res) {
          this.next = null;
          this.modal.open().then();
          this.getDataAsync().then();
        }
      });
  }

  ngOnDestroy(): void {
  }

  onModalClose(event) {
    console.log(event);
    this.dataService.close();
  }

  async getDataAsync() {
    const data = await this.dataService.getData(this.next).toPromise();
    this.next = data.meta.links.next;
  }

  async getParentDataAsync(id) {
    const res = await this.dataService.getParent(id).toPromise();
    this.breadcrumb = res.data;
  }

  onLoadMoreCompleted(event: any) {
    console.log(event);
    if (event && this.next) {
      this.getDataAsync().then();
    }
  }

  async onSortComplete(event: any) {
    console.log(event);
    const data = await this.dataService.sort(this.next, event).toPromise();
    this.next = data.meta.links.next;
  }

  onViewComplete(event: any) {
    this.dataView.viewMode = event;
    this.dataView.container.update();
    this.dataView.updateView();
  }

  tabAction(event: any) {
    if (this.currentTab == event.link) {
      return false;
    }
    this.currentTab = event.link;
    this.updateTitle();
    this.getRootData();
  }

  onBreadcrumb(id?) {
    if (!id) {
      this.getRootData();
    } else {

    }
  }

  updateTitle() {
    const result = this.tabs.find(tab => tab.link === this.currentTab);
    this.title = result.name;
  }

  onDblClick(event: Note) {
    this.dataView.container.clearSelection();
    this.dataService.clear();
    console.log(event);
    this.next = `/note/v1/mixed_entities?parent_id=${event.object.id}`;
    // /note/folders/get_folder_path/96?page=MY_NOT
    this.getDataAsync().then();
    this.getParentDataAsync(event.object.id).then();
  }

  onSelectCompleted() {

    // update icon favorite
    // this.updateMenuFavorite(_.every(this.dataView.selectedDocuments, 'favorite'));

    // check menu view
    // const otherActionsEdit = _.find(this.otherActions, ['action', 'edit']);
    // otherActionsEdit.active = !(this.dataView.selectedDocuments.length > 1);
  }

  // getFolderContre

  private getRootData() {
    this.dataService.clear();
    this.breadcrumb = null;
    switch (this.currentTab) {
      case 'my_note':
        this.next = '/note/v1/mixed_entities?active=true';
        break;
      case 'favourites':
        this.next = '/note/v1/mixed_entities?favourite=true';
        break;
      case 'shared_with_me':
        this.next = '/note/v1/mixed_entities?shared_with_me=true';
        break;
    }
    this.getDataAsync().then();
  }

  private updateMenuFavorite(isFavorite: boolean) {
    // const menuActionsIndex = this.menuActions.findIndex(x => x.action === 'favorite');
    // this.menuActions[menuActionsIndex].icon = isFavorite ? 'fa fa-star' : 'fa fa-star-o';
  }
}
