import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  HostListener
} from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { Constants } from '@shared/constant/config/constants';

import { Subscription } from 'rxjs';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';
import { UrlService, UserService, ApiBaseService } from '@shared/services';
import { noteConstants } from '@notes/shared/config/constants';
import * as fromChatNote from './../../../../../core/store/chat/note.reducer';
import * as fromChatContext from './../../../../../core/store/chat/context.reducer';
import { chatNoteConstants } from '@shared/components/note-list/chat-module/constants';


declare var _: any;

@Component({
  selector: 'folder-item',
  templateUrl: 'folder-item.component.html'
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FolderItemComponent implements OnInit, OnDestroy {
  @Input() data: any;
  @Input() page: string = 'MY_NOTE';
  @Input() sortOption: any;
  @Input() pressingCtrlKey: boolean;
  @Output() onAction: EventEmitter<any> = new EventEmitter<any>();

  tooltip: any = Constants.tooltip;
  selected: boolean = false;
  sub: Subscription;
  urls: any;

  readonly PAGE_TYPE: any = Constants.notePageType;
  readonly noteConstants: any = noteConstants;
  readonly DATE_MAP: any = noteConstants.DATE_MAP;

  constructor(
    public userService: UserService,
    private store: Store<any>,
    private apiBaseService: ApiBaseService,
    private wthConfirm: WthConfirmService,
    private urlService: UrlService,
    private router: Router
  ) {}

  ngOnInit() {
    // this.sub = this.store
    //   .select(fromRoot.getSelectedObjects)
    //   .subscribe((objects: any[]) => {
    //     let sel: boolean = false;
    //     for (let o of objects) {
    //       if (o && o.object_type == 'Note::Folder' && o.id == this.data.id)
    //         sel = true;
    //     }
    //     this.selected = sel;
    //   });
    // this.urls = this.urlService.parse();
  }

  ngOnDestroy() {
    if (this.sub && !this.sub.closed) this.sub.unsubscribe();
  }

  onClick() {
    this.store.dispatch({type: fromChatNote.SET_OBJECTS, payload: []});
    const shared = this.data.role == 'owner' ? '' : 'shared_with_me=true';
    this.apiBaseService
      .get('note/v1/mixed_entities?parent_id=' + this.data.object_id + `&${shared}`)
      .subscribe(res => {
        this.store.dispatch({
          type: fromChatContext.SET_CONTEXT,
          payload: {loading: false, noData: res.data.length == 0}
        });
        this.store.dispatch({
          type: fromChatNote.SET_OBJECTS,
          payload: res.data
        });
      });
      chatNoteConstants
    const page = this.data.role == 'owner' ? chatNoteConstants.PAGE_MY_NOTE : chatNoteConstants.PAGE_SHARED_WITH_ME;
    this.apiBaseService.get(`note/folders/get_folder_path/${this.data.object_id}`, {page: page}).subscribe(res => {
      let breadcrumb = res.data.map(i => {
        i.label = i.name;
        return i;
      })
      breadcrumb.unshift({label: page == chatNoteConstants.PAGE_MY_NOTE ? chatNoteConstants.PAGE_MY_NOTE_DISPLAY : chatNoteConstants.PAGE_SHARED_WITH_ME_DISPLAY});
      this.store.dispatch({
        type: fromChatNote.SET_BREADCRUMB,
        payload: breadcrumb
      });
    });
  }

  onClickMulti() {
    this.store.dispatch({type: fromChatNote.SELECT_MULTIPLE, payload: this.data});
  }
}
