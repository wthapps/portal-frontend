import {
  Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, OnDestroy,
  HostListener
} from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Note } from '../../../../core/shared/models/note.model';
import { Constants } from '../../../../core/shared/config/constants';
import { ZNoteService } from '../../services/note.service';
import * as fromRoot from '../../reducers/index';
import * as note from '../../actions/note';
import { Subscription } from 'rxjs';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'note-item',
  templateUrl: 'note-item.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteItemComponent implements OnInit, OnDestroy {
  @Input() data: Note = new Note();
  @Input() page: string = 'MY_NOTE';
  @Output() onAction: EventEmitter<any> = new EventEmitter<any>();

  readonly tooltip: any = Constants.tooltip;
  readonly PAGE_TYPE: any = Constants.notePageType;
  selected: boolean = false;
  sub: Subscription;
  pressingCtrlKey: boolean;


  @HostListener('document:keydown', ['$event'])
  onKeyDown(ke: KeyboardEvent) {
    if (this.pressedCtrlKey(ke)) {
      this.pressingCtrlKey = true;
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(ke: KeyboardEvent) {
    if (this.pressedCtrlKey(ke)) {
      this.pressingCtrlKey = false;
    }
  }


  constructor(private noteService: ZNoteService,
              private store: Store<fromRoot.State>,
              private router: Router) {
  }


  ngOnInit() {
    this.sub = this.store.select(fromRoot.getSelectedObjects).subscribe((objects: any[]) => {
      let sel: boolean = false;
      for (let o of objects) {
        if (o.object_type == 'note' && o.id == this.data.id) sel = true;
      }
      this.selected = sel;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSelected() {
    this.selected = !this.selected;

    if (this.pressingCtrlKey) {
      this.store.dispatch(new note.Select({
        id: this.data.id,
        object_type: this.data.object_type,
        permission: this.data.permission,
        parent_id: this.data.parent_id
      }));
    } else {
      this.store.dispatch({
        type: note.SELECT_ONE,
        payload: {
          id: this.data.id,
          object_type: this.data.object_type,
          permission: this.data.permission,
          parent_id: this.data.parent_id}
      });
    }
  }

  onClick() {
    this.onSelected();
  }

  onClickMulti() {
    this.store.dispatch(new note.Select({
      id: this.data.id,
      object_type: this.data.object_type,
      permission: this.data.permission,
      parent_id: this.data.parent_id
    }));
  }

  onView() {
    if (this.data['permission'] == 'view') {
      this.noteService.modalEvent({action: 'note:open_note_view_modal', payload: this.data});
    } else {
      this.noteService.modalEvent({action: 'note:open_note_edit_modal', payload: this.data});
    }
  }

  private pressedCtrlKey(ke: KeyboardEvent): boolean {
    return ((ke.keyCode == 17 || ke.keyCode == 18 || ke.keyCode == 91 || ke.keyCode == 93 || ke.ctrlKey) ? true : false);
  }

}
