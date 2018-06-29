import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy
} from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Note } from '@shared/shared/models/note.model';
import { Constants } from '@shared/constant/config/constants';
import { UserService } from '@wth/shared/services';
import { noteConstants, NoteConstants } from '@notes/shared/config/constants';
import * as fromChatNote from './../../../../../core/store/chat/note.reducer';

@Component({
  selector: 'note-item',
  templateUrl: 'note-item.component.html'
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteItemComponent implements OnInit, OnDestroy {
  @Input() data: Note = new Note();
  @Input() page: string = 'MY_NOTE';
  @Input() sortOption: any;
  @Input() pressingCtrlKey: boolean;
  @Output() onAction: EventEmitter<any> = new EventEmitter<any>();

  readonly tooltip: any = Constants.tooltip;
  readonly PAGE_TYPE: any = Constants.notePageType;
  readonly noteConstants: NoteConstants = noteConstants;
  readonly DATE_MAP: any = noteConstants.DATE_MAP;
  selected: boolean = false;
  sub: Subscription;

  constructor(
    public userService: UserService,
    private store: Store<any>,
    private router: Router
  ) {}

  ngOnInit() {
    // this.sub = this.store
    //   .select(fromRoot.getSelectedObjects)
    //   .subscribe((objects: any[]) => {
    //     let sel: boolean = false;
    //     for (let o of objects) {
    //       if (o && o.object_type == 'Note::Note' && o.id == this.data.id)
    //         sel = true;
    //     }
    //     this.selected = sel;
    //   });
  }

  ngOnDestroy() {
    if (this.sub && !this.sub.closed) this.sub.unsubscribe();
  }

  onSelected() {
    this.selected = !this.selected;

    if (this.pressingCtrlKey) {
      // this.store.dispatch(new note.Select(this.data));
    } else {
      // this.store.dispatch({
      //   type: note.SELECT_ONE,
      //   payload: this.data
      // });
    }
  }

  onClick() {
    if (this.pressingCtrlKey) {
      this.onClickMulti();
    } else {
      this.store.dispatch({type: fromChatNote.SELECT_ONE, payload: this.data});
    }
  }

  onClickMulti() {
    this.store.dispatch({type: fromChatNote.SELECT_MULTIPLE, payload: this.data});
  }
}
