import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import 'rxjs/add/operator/take';

import { Constants } from '../../../core/shared/config/constants';
import { ZNoteService } from '../services/note.service';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';
import * as note from '../actions/note';
import { WthConfirmService } from '../../../core/shared/components/confirmation/wth-confirm.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-note-shared-actions-bar',
  templateUrl: 'actions-bar.component.html',
  styleUrls: ['actions-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZNoteSharedActionBarComponent implements OnInit {
  @Input() multiple: boolean = false;
  @Input() data: any;
  @Input() selectedObjects: any[] = [];

  readonly tooltip: any = Constants.tooltip;
  // selectedObjects$: Observable<any[]>;

  constructor(public noteService: ZNoteService,
              private wthConfirm: WthConfirmService,
              public commonEventService: CommonEventService) {
    // this.selectedObjects$ = this.store.select(fromRoot.getSelectedObjects);
  }

  ngOnInit() {
  }

  delete() {
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
          this.commonEventService.broadcast({
            channel: 'noteActionsBar',
            action: 'note:mixed_entity:delete',
            payload: this.selectedObjects
          });
        }
      });
    }
  }

  share() {
    // TODO: Share multiple folders and notes
    if (this.selectedObjects.length > 0) {
      let data = this.selectedObjects;
      this.commonEventService.broadcast({channel: 'noteActionsBar', action: 'note:folder:sharing', payload: data});
    }
  }

  edit() {
    if (this.selectedObjects.length > 0) {
      let selectedObject = this.selectedObjects[0];
      switch (selectedObject.object_type) {
        case 'note':
          this.noteService.modalEvent({action: 'note:open_note_edit_modal', payload: selectedObject});
          break;
        case 'folder':
          this.commonEventService.broadcast({
            channel: 'noteActionsBar',
            action: 'note:folder:edit',
            payload: selectedObject
          });
          break;
      }
    }
  }

  moveToFolder(data?: any) {
    this.commonEventService.broadcast({
      channel: 'noteActionsBar',
      action: 'note:mixed_entity:open_move_to_folder_modal',
      payload: this.selectedObjects
    });
  }

  makeACopy(data?: any) {
    this.commonEventService.broadcast({
      channel: 'noteActionsBar',
      action: 'note:mixed_entity:make_a_copy',
      payload: this.selectedObjects
    });
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
