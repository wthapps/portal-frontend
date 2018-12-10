import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { WTab } from '@shared/components/w-nav-tab/w-nav-tab';
import { WNoteSelectionService } from '@shared/components/w-note-selection/w-note-selection.service';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { Media } from '@shared/shared/models/media.model';
import { Note } from '@shared/shared/models/note.model';
import { BsModalComponent } from 'ng2-bs3-modal';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'w-note-selection',
  templateUrl: 'w-note-selection.component.html',
  styleUrls: ['w-note-selection.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WNoteSelectionComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;
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

  // search
  searchShow: Boolean = false;
  searchText: string;

  // end search
  view$: Observable<string>;
  notes$: Observable<Note[]>;
  selectedNotes$: Observable<Media[]>;
  isLoading: boolean;
  url: string;
  next: any;

  constructor(private noteSelectionService: WNoteSelectionService,
              private objectListService: WObjectListService) {
    this.notes$ = this.noteSelectionService.notes$;
    this.selectedNotes$ = this.objectListService.selectedObjects$;
    this.view$ = this.objectListService.view$;
  }

  ngOnInit(): void {
    this.noteSelectionService.open$
      .pipe(takeUntil(componentDestroyed(this)))
      .subscribe((res: any) => {
        if (res) {
          this.open();
        }
      });
  }

  ngOnDestroy(): void {
  }

  open() {
    this.modal.open().then();
    this.url = '/note/v1/mixed_entities?parent_id=null';
    this.next = this.url;
    this.getData();
  }

  getData() {
    this.isLoading = true;
    this.noteSelectionService.getData(this.url)
      .subscribe(
        (res: any) => {
          if (res && res.meta) {
            this.next = res.meta.links.next;
            this.url = this.next;
          }
        },
        err => console.log(err),
        () => this.isLoading = false
      );
  }

  onCompleteLoadMore(event: boolean) {
    if (event && this.next) {
      this.getData();
    }
  }

  /**
   * Search
   * @param e
   */
  onSearchEnter(e: any) {
    this.searchText = e.search;
  }

  onSearchEscape(e?: any) {
    if (e) {
      this.searchShow = false;
      this.searchText = null;
    }
  }

  /**
   * end Search
   */

  tabAction(event: any) {
    this.noteSelectionService.clear();
    this.currentTab = event.link;
  }

  onInsert() {
    this.noteSelectionService.setSelectedNotes(this.objectListService.getSelectedObjects());
    this.noteSelectionService.clear();
  }

  dismiss(event: any): void {
    console.log('Post Photo Select Component DISMISSED', event);
    this.noteSelectionService.clear();
  }
}
