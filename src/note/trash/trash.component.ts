import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../shared/reducers/index';
import * as context from '../shared/reducers/context';
import * as note from '../shared/actions/note';
import { Note } from '@shared/shared/models/note.model';
import * as listReducer from '../shared/reducers/features/list-mixed-entities';
import { noteConstants } from '@notes/shared/config/constants';
import { WDataViewComponent } from '@shared/components/w-dataView/w-dataView.component';
import { Constants } from '@shared/constant';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';
import { CommonEventService } from '@shared/services';

declare var _: any;
const OBJECT_TYPE = noteConstants.OBJECT_TYPE;

@Component({
  selector: 'z-note-trash',
  templateUrl: 'trash.component.html'
})
export class ZNoteTrashComponent implements OnInit {
  @HostBinding('class') class = 'main-page-body';
  @ViewChild('dataView') dataView: WDataViewComponent;

  noteItems$: Observable<Note[]>;
  folderItems$: Observable<any>;
  selectedObjects$: Observable<any[]>;
  isSelectAll$: Observable<boolean>;
  allItems$: Observable<any[]>;
  context$: Observable<any>;
  currentFolder$: Observable<any>;
  loading$: Observable<any>;

  readonly PAGE_TYPE: any = noteConstants.PAGE_TRASH;

  readonly tooltip: any = Constants.tooltip;
  data$: Observable<any[]>;
  menuActions = {
    restore: {
      active: true,
      icon: 'fa fa-history',
      text: this.tooltip.restore,
      action: 'restore'
    },
    permanentDelete: {
      active: true,
      icon: 'fa fa-trash-o',
      text: this.tooltip.permanentDelete,
      action: 'permanentDelete'
    }
  };

  otherActions = {
    emptyTrash: {
      active: true,
      icon: 'fa fa-trash',
      text: 'Empty Trash',
      action: 'emptyTrash'
    }
  };

  constructor(private store: Store<fromRoot.State>,
              private wthConfirm: WthConfirmService,
              public commonEventService: CommonEventService) {
    this.data$ = this.store.select(listReducer.getAllItems);
  }

  ngOnInit() {
    this.noteItems$ = this.store.select(listReducer.getNotes);
    this.folderItems$ = this.store.select(listReducer.getFolders);
    this.allItems$ = this.store.select(listReducer.getAllItems);
    this.isSelectAll$ = this.store.select(fromRoot.getSelectAll);
    this.selectedObjects$ = this.store.select(fromRoot.getSelectedObjects);
    this.context$ = this.store.select(context.getContext);
    this.currentFolder$ = this.store.select(fromRoot.getCurrentFolder);
    this.loading$ = this.store.select(fromRoot.getLoading);

    this.store.dispatch({
      type: context.SET_CONTEXT,
      payload: {
        page: noteConstants.PAGE_TRASH
      }
    });
    this.store.dispatch({ type: note.TRASH_LOAD });
  }

  onSelectCompleted() {

    // update icon favorite
    // this.updateMenuFavorite(_.every(this.dataView.selectedDocuments, 'favorite'));

    // check menu view
    // this.validatePermission();
  }

  onDblClick(event: any) {
    if (event.object_type === OBJECT_TYPE.FOLDER) {
      this.dataView.container.clearSelection();

      this.wthConfirm.confirm({
        acceptLabel: 'Restore',
        rejectLabel: 'Cancel',
        message: `To view this folder, you'll need to restore it from your trash`,
        header: 'This folder is in your trash',
        accept: () => {
          this.store.dispatch({ type: note.RESTORE, payload: [event] });
        }
      });
    }
  }

  onMenuAction(action: string) {
    const selectedObjects = this.dataView.selectedDocuments;
    const objects = this.dataView.selectedDocuments.map(({ id, object_type, favourite }) => ({
      id,
      object_type,
      favourite
    }));
    switch (action) {
      case 'restore': {
        this.store.dispatch({ type: note.RESTORE, payload: selectedObjects });
        this.commonEventService.broadcast({
          action: 'update',
          channel: 'noteLeftMenu',
          payload: selectedObjects
        });
        break;
      }
      case 'permanentDelete': {
        if (selectedObjects.length >= 1) {
          let message = `
                        You are about to delete Folder(s).<br>
                        Once deleted - you cannot Undo deleting.<br>
                        Folder and all included Notes and sub-folders will be permanently deleted
          `;
          let header = 'Delete Note and Folder';

          if (this.isOnlyNote(selectedObjects)) {
            message = `
                        You are about to delete Note(s).<br> 
                        Once deleted - you cannot Undo deleting.<br>
                        Notes will be permanently deleted
            `;
            header = 'Delete Note';
          }

          if (this.isOnlyFolder(selectedObjects)) {
            header = 'Delete Folder';
          }

          this.wthConfirm.confirm({
            message: message,
            header: header,
            accept: () => {
              this.store.dispatch({
                type: note.PERMANENT_DELETE,
                payload: selectedObjects
              });
            }
          });
        }
        break;
      }
      case 'emptyTrash': {
        this.wthConfirm.confirm({
          acceptLabel: 'Delete',
          rejectLabel: 'Cancel',
          message: `
              All notes and folders in your trash will be permanently deleted.
              <br>
              <strong>This action cannot be undone</strong>
          `,
          header: 'Empty Trash',
          accept: () => {
            this.store.dispatch({ type: note.EMPTY_ALL });
          }
        });
        break;
      }
      default: {
        console.warn('unhandled action: ', action);
      }
    }
  }

  async onSortComplete(event: any) {
  }

  onViewComplete(event: any) {
    this.dataView.viewMode = event;
    this.dataView.container.update();
    this.dataView.updateView();
  }

  private isOnlyNote(selectedObjects): boolean {
    let result = true;
    _.forEach(selectedObjects, (item: any) => {
      if (item.object_type === OBJECT_TYPE.FOLDER) {
        result = false;
        return;
      }
    });
    return result;
  }

  private isOnlyFolder(selectedObjects): boolean {
    let result = true;
    _.forEach(selectedObjects, (item: any) => {
      if (item.object_type === OBJECT_TYPE.NOTE) {
        result = false;
        return;
      }
    });
    return result;
  }
}
