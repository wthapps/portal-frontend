import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ZNoteService } from '../shared/services/note.service';
import * as fromIndex from '../shared/reducers/index';
import * as fromNote from '../shared/actions/note';

import { Note } from '../../core/shared/models/note.model';

@Component({
  moduleId: module.id,
  selector: 'z-note-my-sharing',
  templateUrl: 'my-sharing.component.html'
})
export class ZNoteMySharingComponent implements OnInit, OnDestroy {

  public note$: Observable<Note>;

  private destroySubject: Subject<any> = new Subject<any>();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromIndex.State>,
              private noteService: ZNoteService
  ) {
    this.route.params
      .takeUntil(this.destroySubject)
      .switchMap((params: any) => this.noteService.getAll())
      .subscribe((res: any) => {
      console.debug('inside my-sharing: ', res);
      this.store.dispatch(new fromNote.LoadSuccess(res.data));
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  onNewNote() {
    this.noteService.modalEvent({action: 'note:open_note_add_modal'});
  }

  onFolder() {
    this.noteService.modalEvent({
      action: 'note:folder:create'
    });
  }
}
