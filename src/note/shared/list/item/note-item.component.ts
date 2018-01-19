import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Note } from '@shared/shared/models/note.model';
import { Constants } from '@shared/constant/config/constants';
import { ZNoteService } from '../../services/note.service';
import * as fromRoot from '../../reducers/index';
import * as note from '../../actions/note';
import { NoteConstants, noteConstants } from "../../config/constants";
import { UserService } from '@wth/shared/services';

declare var _: any;

@Component({
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
  readonly noteConstants: NoteConstants = noteConstants;
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


  constructor(public userService: UserService,
              private noteService: ZNoteService,
              private store: Store<fromRoot.State>,
              private router: Router) {
  }


  ngOnInit() {
    this.sub = this.store.select(fromRoot.getSelectedObjects).subscribe((objects: any[]) => {
      let sel: boolean = false;
      for (let o of objects) {
        if (o && o.object_type == 'note' && o.id == this.data.id) sel = true;
      }
      this.selected = sel;
    });
  }

  ngOnDestroy() {
    if(this.sub && !this.sub.closed)
      this.sub.unsubscribe();
  }

  onSelected() {
    this.selected = !this.selected;

    if (this.pressingCtrlKey) {
      this.store.dispatch(new note.Select(this.data));
    } else {
      this.store.dispatch({
        type: note.SELECT_ONE,
        payload: this.data
      });
    }
  }

  onClick() {
    this.onSelected();
  }

  onClickMulti() {
    this.store.dispatch(new note.Select(this.data));
  }

  onView() {
    /*if (this.data['permission'] === 'view') {
      this.noteService.modalEvent({action: 'note:open_note_view_modal', payload: this.data});
    } else {
      this.noteService.modalEvent({action: 'note:open_note_edit_modal', payload: this.data});
    }*/
    // this.router.navigate(['notes', this.data.id]);
    this.router.navigate([{outlets: {detail: ['notes', this.data.id]}}], {queryParamsHandling: 'preserve', preserveFragment: true});
  }

  private pressedCtrlKey(ke: KeyboardEvent): boolean {
    return ((ke.keyCode == 17 || ke.keyCode == 18 || ke.keyCode == 91 || ke.keyCode == 93 || ke.ctrlKey) ? true : false);
  }

}
