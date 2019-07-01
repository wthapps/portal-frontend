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

  readonly tooltip: any = Constants.tooltip;
  data$: Observable<any>;

  title: string;
  breadcrumb: any[];
  searchShow: boolean;
  searchText = '';
  viewMode = 'grid';

  tabs: WTab[] = [
    {
      name: 'My Notes',
      link: 'parent_id=null',
      icon: 'icon-zone-note',
      number: null,
      type: 'tab'
    },
    {
      name: 'Favourites',
      link: 'parent_id=null&favourite=true&owner=true',
      icon: 'fa fa-star',
      number: null,
      type: 'tab'
    }
  ];

  currentTab = this.tabs[0].link;

  parentID: number;
  // TODO Replace this one by dataView.selectedDocuments when supporting share Folder
  // It only shares Note right now
  selectedObjects: Array<any> = [];

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
    this.onSortComplete({sortBy: 'Name', orderBy: 'desc'});
  }

  async getParentDataAsync(id) {
    const res = await this.dataService.getParent(id).toPromise();
    this.breadcrumb = res.data.map(v => {
      return {
        id: v.id,
        name: v.name,
        label: v.name ? v.name : 'My notes',
        routerLink: id ? `/folders/${id}` : '/'
      };
    });
    this.breadcrumb.unshift({ id: null, name: null, label: 'My notes', routerLink: '/' });
    // [
    //   { "id": null, "name": null, "label": "My notes", "routerLink": "/" },
    //   { "id": 96, "name": "10", "object_type": "Note::Folder", "parent_id": null, "label": "10", "routerLink": "/folders/96" },
    //   { "id": 357, "name": "sdfsadf", "object_type": "Note::Folder", "parent_id": 96, "label": "sdfsadf", "routerLink": "/folders/357" }
    // ]

  }

  onLoadMoreCompleted(event: any) {
    console.log(event);
  }

  onSortComplete(event: any) {
    this.dataService.sort(event);
  }

  onViewComplete(event: any) {
    this.viewMode = event;
    this.dataView.viewMode = event;
    this.dataView.container.update();
    this.dataView.updateView();
  }

  tabAction(event: any) {
    if (this.currentTab === event.link) {
      return false;
    }
    this.currentTab = event.link;
    this.updateTitle();
    this.getRootData();
  }

  onBreadcrumb(event?: any) {
    if (event && event.id) {
      this.getFolderContent(event.id);
    } else {
      this.getRootData();
    }
  }

  onDblClick(event: Note) {
    if (event.object_type === 'Note::Folder') {
      this.parentID = event.id;
      this.getFolderContent(event.id);
    }
  }

  onSelectCompleted(objects: Array<any>) {
    let hasFolder = false;
    this.dataView.selectedObjects.forEach(object => {
      if (object.object_type === 'Note::Folder') {
        hasFolder = true;
        return;
      }
    });
    this.selectedObjects = hasFolder ? [] : this.dataView.selectedObjects;
  }

  onSearchEnter(event: any) {
    this.searchText = event.search;
    this.title = 'Search results';
    this.dataService.search(this.searchText);
  }

  onSearchEscape(event: any) {
    this.searchShow = false;
    this.searchText = '';
    this.updateTitle();
    this.dataService.getByParams(this.currentTab);
    console.log('current tab:::', this.currentTab);
  }

  onInsert() {
    this.selectCompleted.emit(this.selectedObjects);
    this.modal.close().then();
  }

  private updateTitle() {
    const result = this.tabs.find(tab => tab.link === this.currentTab);
    this.title = result.name;
  }

  private getFolderContent(id: any) {
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
