import {
  Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, OnDestroy,
  HostListener
} from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Note } from '@shared/shared/models/note.model';
import { Constants } from '@shared/constant/config/constants';
import { ZNoteService } from '../../services/note.service';

import * as fromRoot from '../../reducers/index';
import * as note from '../../actions/note';
import { Subscription } from 'rxjs';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';
import { UrlService, UserService } from "@shared/services";

declare var _: any;

@Component({
  selector: 'folder-item',
  templateUrl: 'folder-item.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FolderItemComponent implements OnInit, OnDestroy {
  @Input() data: any;
  @Input() page: string = 'MY_NOTE';
  @Output() onAction: EventEmitter<any> = new EventEmitter<any>();

  tooltip: any = Constants.tooltip;
  selected: boolean = false;
  sub: Subscription;
  pressingCtrlKey: boolean;
  urls: any;

  readonly PAGE_TYPE: any = Constants.notePageType;

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
              private wthConfirm: WthConfirmService,
              private urlService: UrlService,
              private router: Router) {
  }

  ngOnInit() {
    this.sub = this.store.select(fromRoot.getSelectedObjects).subscribe((objects: any[]) => {
      let sel: boolean = false;
      for(let o of objects) {
        if(o.object_type == 'folder' && o.id == this.data.id) sel = true;
      }
      this.selected = sel;
    });
    this.urls = this.urlService.parse();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onClick() {
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

  onClickMulti() {
    this.store.dispatch(new note.Select(this.data));
  }

  onView() {
    if(!this.data.deleted_at) {
      if (this.urls.paths[0] == 'shared-by-me') {this.router.navigate([`shared-by-me/folders`, this.data.id]); return;}
      if (this.urls.paths[0] == 'shared-with-me') {this.router.navigate([`shared-with-me/folders`, this.data.id]); return;}
      this.router.navigate([`folders`, this.data.id]);
    } else {
      this.wthConfirm.confirm({
        acceptLabel: 'Restore',
        rejectLabel: 'Cancel',
        message: `To view this folder, you'll need to restore it from your trash`,
        header: 'This folder is in your trash',
        accept: () => {
          this.store.dispatch({type: note.RESTORE, payload: [this.data]});
        }
      });
    }
  }

  private pressedCtrlKey(ke: KeyboardEvent): boolean {
    return ((ke.keyCode == 17 || ke.keyCode == 18 || ke.keyCode == 91 || ke.keyCode == 93 || ke.ctrlKey) ? true : false);
  }
}
