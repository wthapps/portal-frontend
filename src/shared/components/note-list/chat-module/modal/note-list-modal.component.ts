import { Component, OnInit, ViewChild, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { WTab } from '@shared/components/w-nav-tab/w-nav-tab';
import { BsModalComponent } from 'ng2-bs3-modal';
import { ApiBaseService } from '@shared/services';
import { Store } from '@ngrx/store';
import * as fromChatNote from './../../../../../core/store/chat/note.reducer';
import * as fromChatContext from './../../../../../core/store/chat/context.reducer';
import { chatNoteConstants, ChatNoteConstants } from '@shared/components/note-list/chat-module/constants';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';

@Component({
  selector: 'chat-note-list-modal',
  templateUrl: './note-list-modal.component.html',
  styleUrls: ['./note-list-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatNoteListModalComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();
  actives: any = [true, false, false];

  breadcrumb: any;
  tooltip: any = chatNoteConstants.tooltip;
  searchShow: any = false;
  insertEnable: any = false;
  objects: any = false;
  nextLink: any = '';
  selectedObjects: any;

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
  currentTab: string; // my_note, favourites, shared_with_me

  constructor(
    private apiBaseService: ApiBaseService,
    private wObjectListService: WObjectListService,
    private store: Store<any>
  ) {
  }

  ngOnInit() {
    this.store.select('notes').subscribe(state => {
      this.breadcrumb = state.breadcrumb;
      this.objects = state.objects;
      this.selectedObjects = state.objects.filter(ob => ob.selected == true);
      if (this.selectedObjects.length > 0) {
        this.insertEnable = true;
      } else {
        this.insertEnable = false;
      }
      this.wObjectListService.setSelectedObjects(this.selectedObjects);
    });
    this.wObjectListService.selectedEvent.subscribe(res => {
      if (res.type == 'close') {
        this.insertEnable = false;
        this.objects = this.objects.map(ob => {
          ob.selected = false;
          return ob;
        });
        this.store.dispatch({ type: fromChatNote.SET_OBJECTS, payload: this.objects });
      }
    });
  }

  open() {
    this.currentTab = 'my_note';

    this.store.dispatch({
      type: fromChatContext.SET_LOADING,
      payload: true
    });
    this.apiBaseService.get('note/v1/mixed_entities', { parent_id: null }).subscribe(res => {
      this.store.dispatch({
        type: fromChatContext.SET_CONTEXT,
        payload: { loading: false, noData: res.data.length == 0 }
      });
      this.store.dispatch({
        type: fromChatNote.SET_OBJECTS,
        payload: res.data
      });
      this.nextLink = res.meta.links.next;
    });
    this.store.dispatch({
      type: fromChatNote.SET_BREADCRUMB,
      payload: [{ label: chatNoteConstants.PAGE_MY_NOTE_DISPLAY }]
    });
    this.searchShow = false;
    this.insertEnable = false;
    this.actives = [true, false, false];
    this.modal.open();
  }

  close() {
    this.modal.close();
  }

  tabAction(event: any) {
    console.log(event);
    this.currentTab = event.link;
    switch (this.currentTab) {
      case 'my_note':
        this.tabMyNote();
        break;
      case 'favourites':
        this.tabFavourites();
        break;
      case 'shared_with_me':
        this.tabSharedWithMe();
        break;
    }
  }


  tabMyNote() {
    this.store.dispatch({
      type: fromChatContext.SET_LOADING,
      payload: true
    });
    this.apiBaseService.get('note/v1/mixed_entities', { parent_id: null }).subscribe(res => {
      this.store.dispatch({
        type: fromChatContext.SET_CONTEXT,
        payload: { loading: false, noData: res.data.length == 0 }
      });
      this.store.dispatch({
        type: fromChatNote.SET_OBJECTS,
        payload: res.data
      });
      this.nextLink = res.meta.links.next;
    });
    this.store.dispatch({
      type: fromChatNote.SET_BREADCRUMB,
      payload: [{ label: chatNoteConstants.PAGE_MY_NOTE_DISPLAY }]
    });
    this.actives = [true, false, false];
  }

  tabFavourites() {
    this.store.dispatch({
      type: fromChatContext.SET_LOADING,
      payload: true
    });
    this.apiBaseService
      .get('note/v1/mixed_entities?favourite=true')
      .subscribe(res => {
        this.store.dispatch({
          type: fromChatContext.SET_CONTEXT,
          payload: { loading: false, noData: res.data.length == 0 }
        });
        this.store.dispatch({
          type: fromChatNote.SET_OBJECTS,
          payload: res.data
        });
        this.nextLink = res.meta.links.next;
      });
    this.store.dispatch({
      type: fromChatNote.SET_BREADCRUMB,
      payload: [{ label: chatNoteConstants.PAGE_NOTE_FAVOURITE_DISPLAY }]
    });
    this.actives = [false, true, false];
  }

  tabSharedWithMe() {
    this.store.dispatch({
      type: fromChatContext.SET_LOADING,
      payload: true
    });
    this.apiBaseService
      .get('note/v1/mixed_entities?shared_with_me=true')
      .subscribe(res => {
        this.store.dispatch({
          type: fromChatContext.SET_CONTEXT,
          payload: { loading: false, noData: res.data.length == 0 }
        });
        this.store.dispatch({
          type: fromChatNote.SET_OBJECTS,
          payload: res.data
        });
        this.nextLink = res.meta.links.next;
      });
    this.store.dispatch({
      type: fromChatNote.SET_BREADCRUMB,
      payload: [{ label: chatNoteConstants.PAGE_SHARED_WITH_ME_DISPLAY }]
    });
    this.actives = [false, false, true];
  }

  onSearchEnter(e: any) {
    if (e.search) {
      this.apiBaseService
        .post('note/v1/mixed_entities/search', { q: e.search })
        .subscribe(res => {
          this.store.dispatch({
            type: fromChatContext.SET_CONTEXT,
            payload: { loading: false, noData: res.data.length == 0 }
          });
          this.store.dispatch({
            type: fromChatNote.SET_OBJECTS,
            payload: res.data
          });
          this.nextLink = res.meta.links.next;
          this.actives = [false, false, false];
          this.store.dispatch({
            type: fromChatNote.SET_BREADCRUMB,
            payload: [{ label: 'Search result' }]
          });
        });
    }
  }

  onSearchEscape(e: any) {
    this.searchShow = false;
  }

  insertNotes() {
    this.onSelect.emit(this.selectedObjects);
  }

  doEvent(e: any) {

  }

  onBreadcrumbAction(e: any) {
    if (e.action == 'click') {
      this.getNotesAndBreadcrumb(e.payload);
    }
  }

  getNotesAndBreadcrumb(item: any) {
    this.store.dispatch({ type: fromChatNote.SET_OBJECTS, payload: [] });
    this.store.dispatch({ type: fromChatContext.SET_LOADING, payload: true });
    if (item.object_type) {
      const parent = item.id ? 'parent_id=' + item.id : '';
      const page = item.permission == 'owner' ? 'MY_NOTE' : 'SHARED_WITH_ME';
      const shared = item.permission == 'owner' ? '' : 'shared_with_me=true';

      this.apiBaseService
        .get('note/v1/mixed_entities?' + parent + `&${shared}`)
        .subscribe(res => {
          this.store.dispatch({
            type: fromChatContext.SET_CONTEXT,
            payload: { loading: false, noData: res.data.length == 0 }
          });
          this.store.dispatch({
            type: fromChatNote.SET_OBJECTS,
            payload: res.data
          });
        });

      this.apiBaseService.get(`note/folders/get_folder_path/${item.id}`, { page: page }).subscribe(res => {
        this.store.dispatch({
          type: fromChatContext.SET_CONTEXT,
          payload: { loading: false, noData: res.data.length == 0 }
        });
        let breadcrumb = res.data.map(i => {
          i.label = i.name;
          return i;
        });
        breadcrumb.unshift({ label: page == 'MY_NOTE' ? 'My notes' : 'Shared with me' });
        this.store.dispatch({
          type: fromChatNote.SET_BREADCRUMB,
          payload: breadcrumb
        });
      });
    } else {
      const shared: string = (item.label == 'My notes') ? 'parent_id=null' : 'shared_with_me=true';
      this.apiBaseService
        .get('note/v1/mixed_entities?' + shared)
        .subscribe(res => {
          this.store.dispatch({
            type: fromChatContext.SET_CONTEXT,
            payload: { loading: false, noData: res.data.length == 0 }
          });
          this.store.dispatch({
            type: fromChatNote.SET_OBJECTS,
            payload: res.data
          });
        });
      this.store.dispatch({
        type: fromChatNote.SET_BREADCRUMB,
        payload: [{ label: item.label }]
      });
      this.actives = shared == '' ? [true, false, false] : [false, false, true];
    }
  }

  loadMore() {
    if (this.nextLink) {
      this.apiBaseService.get(this.nextLink).subscribe(res => {
        this.objects = [...this.objects, ...res.data];
        this.store.dispatch({
          type: fromChatNote.SET_OBJECTS,
          payload: this.objects
        });
        this.nextLink = res.meta.links.next;
      });
    }
  }
}
