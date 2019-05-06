import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { WDataViewComponent } from '../w-dataView/w-dataView.component';
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
  @Output() selectCompleted: EventEmitter<any> = new EventEmitter<any>();

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
      link: 'parent_id=null&favourites=true',
      icon: 'fa fa-star',
      number: null,
      type: 'tab'
    },
    {
      name: 'Shared with me',
      link: 'parent_id=null&shared_with_me=true',
      icon: 'fw fw-shared-with-me',
      number: null,
      type: 'tab'
    }
  ];

  currentTab = this.tabs[0].link;

  parentID: number;

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
          this.open();
        }
      });
  }

  ngOnDestroy(): void {
  }

  open() {
    this.modal.open().then();
    this.getDataAsync().then();
  }

  close() {
    this.dataService.close();
  }

  async getDataAsync() {
    await this.dataService.getData(this.currentTab, this.parentID).toPromise();
  }

  async getParentDataAsync(id) {
    const res = await this.dataService.getParent(id).toPromise();
    this.breadcrumb = res.data;
  }

  onLoadMoreCompleted(event: any) {
    console.log(event);
  }

  onSortComplete(event: any) {
    this.dataService.sort(event);
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
    if (event.object_type === 'Note::Folder') {
      this.parentID = event.id;
      this.getFolderContent(event.id);
    }
  }

  onSelectCompleted() {
    // console.log('onSelectCompleted');
    // this.selectCompleted.emit(this.dataView.selectedDocuments);
    // this.modal.close().then();
  }

  onInsert() {
    console.log('onInsert: ', this.dataView.selectedDocuments);
    this.selectCompleted.emit(this.dataView.selectedDocuments);
    this.modal.close().then();
  }

  private updateTitle() {
    const result = this.tabs.find(tab => tab.link === this.currentTab);
    this.title = result.name;
  }

  private getFolderContent(id) {
    this.parentID = id;
    this.dataService.clear();
    this.getDataAsync().then();
    this.getParentDataAsync(id).then();
    if (this.dataView && this.dataView.container) {
      this.dataView.container.clearSelection();
    }
  }

  private getRootData() {
    this.dataService.clear();
    this.breadcrumb = null;
    this.parentID = null;
    this.getDataAsync().then();
  }
}
