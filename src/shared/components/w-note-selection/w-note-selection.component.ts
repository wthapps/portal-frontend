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

  title: string;
  breadcrumb: Note[];
  searchShow: boolean;
  tabs: WTab[] = [
    {
      name: 'My Note',
      link: 'parent_id=null',
      icon: 'icon-zone-note',
      number: null,
      type: 'tab'
    },
    {
      name: 'Favourites',
      link: 'favourites=true',
      icon: 'fa fa-star',
      number: null,
      type: 'tab'
    },
    {
      name: 'Shared with me',
      link: 'shared_with_me=true',
      icon: 'fw fw-shared-with-me',
      number: null,
      type: 'tab'
    }
  ];

  currentTab = 'parent_id=null'; // my_note, favourites, shared_with_me
  current: string;
  next: string;

  constructor(private dataService: WNoteSelectionService) {
    this.data$ = this.dataService.data$;
    this.updateTitle();
    this.current = this.buildLink();
  }

  ngOnInit(): void {
    this.dataService.open$
      .pipe(takeUntil(componentDestroyed(this)))
      .subscribe((res: any) => {
        console.log(res);
        if (res) {
          this.next = this.current;
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
    const data = await this.dataService.sort(this.current, event).toPromise();
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
      this.getFolderContent(id);
    }
  }

  onDblClick(event: Note) {
    if (event.object.object_type === 'Note::Folder') {
      this.getFolderContent(event.object.id);
    }
  }

  onSelectCompleted() {

    // update icon favorite
    // this.updateMenuFavorite(_.every(this.dataView.selectedDocuments, 'favorite'));

    // check menu view
    // const otherActionsEdit = _.find(this.otherActions, ['action', 'edit']);
    // otherActionsEdit.active = !(this.dataView.selectedDocuments.length > 1);
  }

  private updateTitle() {
    const result = this.tabs.find(tab => tab.link === this.currentTab);
    this.title = result.name;
  }

  private getFolderContent(id) {
    this.dataService.clear();
    this.next = this.buildLink(id);
    this.getDataAsync().then();
    this.getParentDataAsync(id).then();
    if (this.dataView && this.dataView.container) {
      this.dataView.container.clearSelection();
    }
  }

  private getRootData() {
    this.dataService.clear();
    this.breadcrumb = null;
    this.current = this.buildLink();
    this.next = this.current;
    this.getDataAsync().then();
  }

  private buildLink(id?) {
    if (id) {
      return `note/v1/mixed_entities?parent_id=${id}`
    }
    return `note/v1/mixed_entities?${this.currentTab}`;
  }
}
