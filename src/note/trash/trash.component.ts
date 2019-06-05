import { Component, OnInit, HostBinding, ViewChild, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
import { SortOption } from '@notes/shared/models/context.model';
import * as contextReducer from '../shared/reducers/context';

declare var _: any;
const OBJECT_TYPE = noteConstants.OBJECT_TYPE;

@Component({
  selector: 'z-note-trash',
  templateUrl: 'trash.component.html'
})
export class ZNoteTrashComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'main-page-body';
  @ViewChild('dataView') dataView: WDataViewComponent;

  noteItems$: Observable<Note[]>;
  folderItems$: Observable<any>;
  selectedObjects$: Observable<any[]>;
  isSelectAll$: Observable<boolean>;
  allItems$: Observable<any[]>;
  context;
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

  noOtherActions = true;

  otherActions = {
    emptyTrash: {
      active: true,
      icon: 'fa fa-trash',
      text: 'Empty Trash',
      action: 'emptyTrash'
    }
  };

  subTitle = `Moves notes or folders you want to permanently delete to Trash.<br>Click 'Empty Trash' from the Trash's menu to permanently delete these files.`

  private destroySubject: Subject<any> = new Subject();

  constructor(private store: Store<fromRoot.State>,
              private wthConfirm: WthConfirmService,
              public commonEventService: CommonEventService) {
    this.data$ = this.store.select(listReducer.getAllItems);
  }

  ngOnInit() {
    this.noteItems$ = this.store.select(listReducer.getNotes);
    this.folderItems$ = this.store.select(listReducer.getFolders);
    this.allItems$ = this.store.select(listReducer.getAllItems);
    this.store.select('context').pipe(takeUntil(this.destroySubject))
      .subscribe(ctx => this.context = ctx);
    this.currentFolder$ = this.store.select(fromRoot.getCurrentFolder);

    this.store.dispatch({ type: note.TRASH_LOAD });
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  onSelectCompleted() {

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
    const objects = this.dataView.selectedObjects;
    switch (action) {
      case 'restore': {
        this.store.dispatch({ type: note.RESTORE, payload: objects });
        this.commonEventService.broadcast({
          action: 'update',
          channel: 'noteLeftMenu',
          payload: objects
        });
        break;
      }
      case 'permanentDelete': {
        if (objects.length >= 1) {
          let message = `
                        You are about to delete Folder(s).<br>
                        Once deleted - you cannot Undo deleting.<br>
                        Folder and all included Notes and sub-folders will be permanently deleted
          `;
          let header = 'Delete Note and Folder';

          if (this.isOnlyNote(objects)) {
            message = `
                        You are about to delete Note(s).<br> 
                        Once deleted - you cannot Undo deleting.<br>
                        Notes will be permanently deleted
            `;
            header = 'Delete Note';
          }

          if (this.isOnlyFolder(objects)) {
            header = 'Delete Folder';
          }

          this.wthConfirm.confirm({
            message: message,
            header: header,
            accept: () => {
              this.store.dispatch({
                type: note.PERMANENT_DELETE,
                payload: objects
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

  onSortComplete(event: any) {
    const sortOption: SortOption = { field: event.sortBy.toLowerCase(), desc: event.orderBy === 'desc' };
    this.store.dispatch({
      type: contextReducer.SET_CONTEXT,
      payload: {
        sort: sortOption
      }
    });
  }

  onViewComplete(event: any) {
    // this.dataView.viewMode = event;
    this.store.dispatch({
      type: contextReducer.SET_CONTEXT,
      payload: {
        viewMode: event
      }
    });
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
