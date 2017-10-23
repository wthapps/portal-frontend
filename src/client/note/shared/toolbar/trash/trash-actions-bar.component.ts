import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';

import * as note from '../../actions/note';
import * as fromRoot from '../../reducers/index';

import { Constants } from '../../../../core/shared/config/constants';
import { ZNoteService } from '../../services/note.service';
import { WthConfirmService } from '../../../../core/shared/components/confirmation/wth-confirm.service';
import { CommonEventService } from '../../../../core/shared/services/common-event/common-event.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-note-shared-trash-actions-bar',
  templateUrl: 'trash-actions-bar.component.html',
  styleUrls: ['trash-actions-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZNoteSharedTrashActionBarComponent implements OnInit {
  @Input() selectedObjects: any[] = [];
  @Input() toolbarOnly: boolean;

  readonly tooltip: any = Constants.tooltip;

  constructor(public noteService: ZNoteService,
              private wthConfirm: WthConfirmService,
              private store: Store<fromRoot.State>,
              public commonEventService: CommonEventService) {
  }

  ngOnInit() {
  }

  permanentDelete() {
    if (this.selectedObjects.length >= 1) {
      let message = `You are about to delete Folder(s).
       Once deleted - you cannot Undo deleting. 
       <br/>&emsp;Folder and all included Notes and sub-folders will be permanently deleted`;
      let header = 'Delete Note and Folder';

      if (this.isOnlyNote()) {
        message = `You are about to delete Note(s).
       Once deleted - you cannot Undo deleting. 
       <br/>&emsp;Notes will be permanently deleted`;
        header = 'Delete Note';
      }

      if (this.isOnlyFolder()) {
        header = 'Delete Folder'
      }

      this.wthConfirm.confirm({
        message: message,
        header: header,
        accept: () => {
          this.store.dispatch({type: note.PERMANENT_DELETE, payload: this.selectedObjects});
        }
      });
    }
  }

  emptyAll() {
    this.wthConfirm.confirm({
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      message: `All notes and folders in your trash will be permanently deleted.
      <br/>&emsp;<b>This action cannot be undo</b>
      `,
      header: 'Empty Trash',
      accept: () => {
        this.store.dispatch({type: note.PERMANENT_DELETE, payload: this.selectedObjects});
      }
    });
  }

  restore() {
    this.store.dispatch({type: note.RESTORE, payload: this.selectedObjects});
  }
  isOnlyNote(): boolean {
    let result = true;
    _.forEach(this.selectedObjects, (item: any) => {
      if (item.object_type == 'folder') {
        result = false;
        return;
      }
    });
    return result;
  }

  isOnlyFolder(): boolean {
    let result = true;
    _.forEach(this.selectedObjects, (item: any) => {
      if (item.object_type == 'note') {
        result = false;
        return;
      }
    });
    return result;
  }

}
