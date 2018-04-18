import { Component, OnInit, ViewChild, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';
import { ApiBaseService } from '@shared/services';
import { Store } from '@ngrx/store';
import * as fromChatNote from './../../../../../core/store/chat/note.reducer';

@Component({
  selector: 'chat-note-list-modal',
  templateUrl: './note-list-modal.component.html',
  styleUrls: ['./note-list-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatNoteListModalComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  @Output() insertNoteEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private apiBaseService: ApiBaseService,
    private store: Store<any>
  ) {}

  ngOnInit() {
    // this.store.dispatch()
  }

  open() {
    this.apiBaseService.get('note/v1/mixed_entities').subscribe(res => {
      this.store.dispatch({
        type: fromChatNote.SET_OBJECTS,
        payload: res.data
      });
    });
    this.modal.open();
  }

  close() {
    this.modal.close();
  }

  tabMyNote() {
    this.apiBaseService.get('note/v1/mixed_entities').subscribe(res => {
      this.store.dispatch({
        type: fromChatNote.SET_OBJECTS,
        payload: res.data
      });
    });
  }

  tabFavourites() {
    this.apiBaseService
      .get('note/v1/mixed_entities?favourite=true')
      .subscribe(res => {
        this.store.dispatch({
          type: fromChatNote.SET_OBJECTS,
          payload: res.data
        });
      });
  }

  tabSharedWithMe() {
    this.apiBaseService
      .get('note/v1/mixed_entities?shared_with_me=true')
      .subscribe(res => {
        this.store.dispatch({
          type: fromChatNote.SET_OBJECTS,
          payload: res.data
        });
      });
  }

  onEnter(e: any) {
    if (e.search) {
      this.apiBaseService
        .post('note/v1/mixed_entities/search', { q: e.search })
        .subscribe(res => {
          this.store.dispatch({
            type: fromChatNote.SET_OBJECTS,
            payload: res.data
          });
        });
    }
  }

  onEscape(e: any) {}

  insertNotes() {
    this.insertNoteEvent.emit();
  }

  doEvent(e: any) {

  }
}
