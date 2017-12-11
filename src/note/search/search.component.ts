import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ServiceManager } from '@shared/shared/services/service-manager';
import { UrlService } from '@shared/shared/services/url.service';
import { ApiBaseService } from '@shared/shared/services/apibase.service';
import { Observable } from 'rxjs/Observable';
import { Note } from '@shared/shared/models/note.model';
import { Folder } from '../shared/reducers/folder';
import { Store } from '@ngrx/store';
import * as fromRoot from '../shared/reducers/index';
import * as fromNote from '../shared/actions/note';

@Component({
  selector: 'z-note-search',
  templateUrl: 'search.component.html'
})
export class ZNoteSearchComponent implements OnInit, OnDestroy {
  event: any;
  params: any;

  public noteItems$: Observable<Note[]>;
  public folderItems$: Observable<Folder[]>;
  sortOption$: Observable<any>;
  nodeState$: Observable<any>;
  selectedObjects$: Observable<any[]>;
  selectAll$: Observable<boolean>;
  currentFolderPath$: Observable<any[]>;
  viewMode$: Observable<any>;
  loading$: Observable<boolean>;

  constructor(private router: Router,
    private urlService: UrlService,
    private store: Store<any>,
    private apiBaseService: ApiBaseService) {
    this.noteItems$ = this.store.select(fromRoot.getSortedNotes);
    this.folderItems$ = this.store.select(fromRoot.getSortedFolders);
    this.sortOption$ = this.store.select(fromRoot.getSortOption);
    this.viewMode$ = this.store.select(fromRoot.getViewMode);
    this.selectedObjects$ = this.store.select(fromRoot.getSelectedObjects);
    this.currentFolderPath$ = this.store.select(fromRoot.getCurrentFolderPath);
    this.selectAll$ = this.store.select(fromRoot.getSelectAll);
    this.loading$ = this.store.select(fromRoot.getLoading);

    this.event = this.router.events
    .filter((event: any) => event instanceof NavigationEnd)
    .subscribe((event: NavigationEnd) => {
      this.params = this.urlService.getQuery();
      this.getSearchResult();
    });
  }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    if(event) this.event.unsubscribe();
  }

  getSearchResult() {
    this.apiBaseService.get(`note/search`, {q: this.params['q']}).subscribe((res: any) => {
      this.store.dispatch(new fromNote.LoadSuccess(res.data));
    });
  }

  onNewNote() {

  }

  onFolder() {

  }
}
