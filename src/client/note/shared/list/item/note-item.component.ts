import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Note } from '../../../../core/shared/models/note.model';
import { Constants } from '../../../../core/shared/config/constants';
import { ZNoteService } from '../../services/note.service';
import * as fromRoot from '../../reducers/index';
import * as note from '../../actions/note';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'note-item',
  templateUrl: 'note-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteItemComponent implements OnInit {
  @Input() data: Note = new Note();
  tooltip: any = Constants.tooltip;
  @Input() readonly: boolean = false;


  // selected: boolean = false;
  isSelectAll$: Observable<boolean>;

  constructor(private noteService: ZNoteService,
              private store: Store<fromRoot.State>,
              private router: Router) {
    // this.noteService.isSelectAll$.subscribe((isSelectAll: boolean)=> {
    //   this.selected = isSelectAll;
    // });

    this.isSelectAll$ = this.store.select(fromRoot.getSelectAll);
  }

  ngOnInit() {
  }

  onSelected() {
    // this.selected = !this.selected;
    // if (this.selected) {
    //   this.noteService.addItemSelectedObjects(this.data);
    // } else {
    //   this.noteService.removeItemSelectedObjects(this.data);
    // }

    this.store.dispatch(new note.Select({id: this.data.id, object_type: this.data.object_type, parent_id: this.data.parent_id}));
    // this.store.dispatch({type: note.SELECT_ONE, payload: {id: this.data.id, object_type: this.data.object_type, parent_id: this.data.parent_id}});
  }

  onClick() {
    this.onSelected();
    console.log('click');
  }

  onView() {
    if(this.readonly) {
      this.noteService.modalEvent({action: 'note:open_note_view_modal', payload: this.data});
    } else {
      this.noteService.modalEvent({action: 'note:open_note_edit_modal', payload: this.data});
    }
  }
}
