import { Component, OnInit, ViewChild, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';
import { ApiBaseService } from '@shared/services';
import { Store } from '@ngrx/store';
import * as fromChatNote from './../../../../../core/store/chat/note.reducer';
import { chatNoteConstants } from '@shared/components/note-list/chat-module/constants';
import { log } from 'util';

@Component({
  selector: 'chat-note-list-modal',
  templateUrl: './note-list-modal.component.html',
  styleUrls: ['./note-list-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatNoteListModalComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  @Output() insertNoteEvent: EventEmitter<any> = new EventEmitter<any>();
  actives: any = [true, false, false];

  breadcrumb: any;

  constructor(
    private apiBaseService: ApiBaseService,
    private store: Store<any>
  ) {}

  ngOnInit() {
    // this.store.dispatch()
    this.store.select('notes').subscribe(state => {
      this.breadcrumb = state.breadcrumb;
    })
  }

  open() {
    this.apiBaseService.get('note/v1/mixed_entities').subscribe(res => {
      this.store.dispatch({
        type: fromChatNote.SET_OBJECTS,
        payload: res.data
      });
    });
    this.store.dispatch({
      type: fromChatNote.SET_BREADCRUMB,
      payload: [{label: chatNoteConstants.PAGE_MY_NOTE_DISPLAY}]
    });
    this.modal.open();
  }

  close() {
    this.modal.close();
  }

  tabMyNote(e: any) {
    console.log(e);

    this.apiBaseService.get('note/v1/mixed_entities').subscribe(res => {
      this.store.dispatch({
        type: fromChatNote.SET_OBJECTS,
        payload: res.data
      });
    });
    this.store.dispatch({
      type: fromChatNote.SET_BREADCRUMB,
      payload: [{label: chatNoteConstants.PAGE_MY_NOTE_DISPLAY}]
    });
    this.actives = [true, false, false];
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
    this.store.dispatch({
      type: fromChatNote.SET_BREADCRUMB,
      payload: [{label: chatNoteConstants.PAGE_NOTE_FAVOURITE_DISPLAY}]
    });
    this.actives = [false, true, false];
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
    this.store.dispatch({
      type: fromChatNote.SET_BREADCRUMB,
      payload: [{label: chatNoteConstants.PAGE_SHARED_WITH_ME_DISPLAY}]
    });
    this.actives = [false, false, true];
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

  tabClick(e: any) {
    console.log(e);

  }

  onEscape(e: any) {}

  insertNotes() {
    this.insertNoteEvent.emit();
  }

  doEvent(e: any) {

  }

  onBreadcrumbAction(e: any) {
    if(e.action == 'click') {
      this.getNotesAndBreadcrumb(e.payload);
    }
  }

  getNotesAndBreadcrumb(item: any) {
    this.store.dispatch({type: fromChatNote.SET_OBJECTS, payload: []});
    if (item.object_type) {
      const parent = item.object_id ? 'parent_id=' + item.object_id : '';
      const page = item.permission == 'owner' ? 'MY_NOTE' : 'SHARED_WITH_ME';
      const shared = item.permission == 'owner' ? '' : 'shared_with_me=true';

      this.apiBaseService
      .get('note/v1/mixed_entities?' + parent + `&${shared}`)
      .subscribe(res => {
        this.store.dispatch({
          type: fromChatNote.SET_OBJECTS,
          payload: res.data
        });
      });

      this.apiBaseService.get(`note/folders/get_folder_path/${item.id}`, {page: page}).subscribe(res => {
        let breadcrumb = res.data.map(i => {
          i.label = i.name;
          return i;
        })
        breadcrumb.unshift({label: page == 'MY_NOTE' ? 'My notes' : 'Shared with me'});
        this.store.dispatch({
          type: fromChatNote.SET_BREADCRUMB,
          payload: breadcrumb
        });
      });
    } else {
      const shared = item.label == 'My notes' ? '' : 'shared_with_me=true';
      this.apiBaseService
      .get('note/v1/mixed_entities?' + shared)
      .subscribe(res => {
        this.store.dispatch({
          type: fromChatNote.SET_OBJECTS,
          payload: res.data
        });
      });
      this.store.dispatch({
          type: fromChatNote.SET_BREADCRUMB,
          payload: [{label: item.label}]
        });
      this.actives = shared == '' ? [true, false, false] : [false, false, true]
    }
  }
}
