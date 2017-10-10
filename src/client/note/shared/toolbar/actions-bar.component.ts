import { Component, OnInit, Input } from '@angular/core';
import { Constants } from '../../../core/shared/config/constants';
import { ZNoteService } from '../services/note.service';
import { Note } from '../../../core/shared/models/note.model';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';
import * as note from '../actions/note';
import * as fromRoot from '../reducers/index';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';
import { WthConfirmService } from '../../../core/shared/components/confirmation/wth-confirm.service';

@Component({
  moduleId: module.id,
  selector: 'z-note-shared-actions-bar',
  templateUrl: 'actions-bar.component.html',
  styleUrls: ['actions-bar.component.css']
})
export class ZNoteSharedActionBarComponent implements OnInit {
  @Input() multiple: boolean = false;
  @Input() data: Note;
  @Input() selectedObjects: any[] = [];
  readonly tooltip: any = Constants.tooltip;
  // selectedObjects$: Observable<any[]>;

  constructor(public noteService: ZNoteService,
              private store: Store<fromRoot.State>,
              private wthConfirm: WthConfirmService,
              public commonEventService: CommonEventService) {
    // this.selectedObjects$ = this.store.select(fromRoot.getSelectedObjects);
  }

  ngOnInit() {
  }

  onDelete() {
    if (this.multiple) {
      // TODO:
      // this.noteService.deleteNote();

      this.wthConfirm.confirm({
        message: 'Are you sure you want to delete following objects?',
        header: 'Delete Objects',
        accept: () => {
          this.store.dispatch(new note.MultiDelete());
        }
      });
    } else {
      this.wthConfirm.confirm({
        message: 'Are you sure you want to delete this object?',
        header: 'Delete Object',
        accept: () => {
          this.store.dispatch(new note.Delete([{id: this.data.id, object_type: this.data.object_type}]));
        }
      });
    }

  }

  onShare() {
    this.commonEventService.broadcast({channel: 'noteActionsBar', action: 'note:folder:sharing', payload: this.data});
  }

  onEdit() {
    if(this.selectedObjects.length > 0) {
      let selectedObject = this.selectedObjects[0];
      switch (selectedObject.object_type) {
        case 'note':
          this.noteService.modalEvent({action: 'note:open_note_edit_modal', payload: selectedObject});
          break;
        case 'folder':
          this.commonEventService.broadcast({channel: 'noteActionsBar', action: 'note:folder:edit', payload: selectedObject});
          break;
      }
    }
  }

  onMoveToFolder() {
    this.store.select(fromRoot.getFirstSelectedObject)
      .take(1)
      .subscribe((selectedObject: any) => {
        if (!selectedObject) {
          console.error('No selected Objects to Edit');
          return;
        }
        switch (selectedObject.object_type) {
          case 'folder':
            this.commonEventService.broadcast({
              channel: 'noteActionsBar',
              action: 'note:folder:move_to_folder',
              payload: selectedObject
            });
            break;
        }
      });
  }
}
