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

import { Subscription } from 'rxjs/Subscription';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';
import { UrlService, UserService, ApiBaseService } from '@shared/services';
import { noteConstants } from '@notes/shared/config/constants';
import * as fromChatNote from './../../../../../core/store/chat/note.reducer';


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
    this.apiBaseService
      .get('note/v1/mixed_entities?parent_id=' + this.data.object_id)
      .subscribe(res => {
        this.store.dispatch({
          type: fromChatNote.SET_OBJECTS,
          payload: res.data
        });
      });

  }

  onClickMulti() {
    this.store.dispatch({type: fromChatNote.SELECT_MULTIPLE, payload: this.data});
  }
}
