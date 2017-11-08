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
import { WthConfirmService } from '../../../../core/shared/components/confirmation/wth-confirm.service';

declare var _: any;

@Component({
  moduleId: module.id,
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

  constructor(private noteService: ZNoteService,
              private store: Store<fromRoot.State>,
              private wthConfirm: WthConfirmService,
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

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onClick() {
    this.selected = !this.selected;
    console.log(this.data);

    if (this.pressingCtrlKey) {
      this.store.dispatch(new note.Select({
        id: this.data.id,
        object_type: this.data.object_type,
        name: this.data.name,
        parent_id: this.data.parent_id
      }));
    } else {
      this.store.dispatch({
        type: note.SELECT_ONE,
        payload: {
          id: this.data.id,
          object_type: this.data.object_type,
          name: this.data.name,
          parent_id: this.data.parent_id
        }
      });
    }
  }

  onClickMulti() {
    this.store.dispatch(new note.Select({
      id: this.data.id,
      object_type: this.data.object_type,
      name: this.data.name,
      parent_id: this.data.parent_id
    }));
  }

  onView() {
    if(!this.data.deleted_at)
      this.router.navigate([`/folders`, this.data.id]);
    else {
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
