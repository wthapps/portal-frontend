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
import { ZNoteService } from '../../services/note.service';

import * as fromRoot from '../../reducers/index';
import * as note from '../../actions/note';
import { Subscription } from 'rxjs';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';
import { UrlService, UserService } from '@shared/services';
import { noteConstants, NoteConstants } from '../../config/constants';

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
  readonly noteConstants: NoteConstants = noteConstants;
  readonly DATE_MAP: any = noteConstants.DATE_MAP;

  constructor(
    public userService: UserService,
    private noteService: ZNoteService,
    private store: Store<fromRoot.State>,
    private wthConfirm: WthConfirmService,
    private urlService: UrlService,
    private router: Router
  ) {}

  ngOnInit() {
    this.sub = this.store
      .select(fromRoot.getSelectedObjects)
      .subscribe((objects: any[]) => {
        let sel: boolean = false;
        for (let o of objects) {
          if (o && o.object_type == 'Note::Folder' && o.id == this.data.id)
            sel = true;
        }
        this.selected = sel;
      });
    this.urls = this.urlService.parse();
  }

  ngOnDestroy() {
    if (this.sub && !this.sub.closed) this.sub.unsubscribe();
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
    if (!this.data.deleted_at) {
      if (this.urls.paths[0] == 'shared-by-me') {
        this.router.navigate([`shared-by-me/folders`, this.data.id]);
        return;
      }
      if (
        this.urls.paths[0] == 'shared-with-me' ||
        this.data.permission != 'owner'
      ) {
        this.router.navigate([`shared-with-me/folders`, this.data.id]);
        return;
      }
      this.router.navigate([`folders`, this.data.id]);
    } else {
      this.wthConfirm.confirm({
        acceptLabel: 'Restore',
        rejectLabel: 'Cancel',
        message: `To view this folder, you'll need to restore it from your trash`,
        header: 'This folder is in your trash',
        accept: () => {
          this.store.dispatch({ type: note.RESTORE, payload: [this.data] });
        }
      });
    }
  }
}
