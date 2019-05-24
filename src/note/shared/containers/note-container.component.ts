import { ApiBaseService } from '@shared/services';
import { Component, HostBinding, Input, OnInit, ViewChild, ViewEncapsulation, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';


import { ZNoteService } from '../services/note.service';
import * as listReducer from '../reducers/features/list-mixed-entities';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';
import { WDataViewComponent } from '@shared/components/w-dataView/w-dataView.component';
import { Constants } from '@shared/constant';
import { noteConstants } from '../config/constants';
import * as note from '../actions/note';
import * as contextReducer from '../reducers/context';
import { CommonEventService } from '@shared/services';
import { SortOption } from '../models/context.model';

declare var _: any;
const OBJECT_TYPE = noteConstants.OBJECT_TYPE;

@Component({
  selector: 'z-note-container',
  templateUrl: 'note-container.component.html',
  styleUrls: ['note-container.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZNoteContainerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() breadcrumbs: any = null;
  @Input() enableSort = true;
  @HostBinding('class') class = 'main-page-body';
  @ViewChild('dataView') dataView: WDataViewComponent;

  readonly tooltip: any = Constants.tooltip;
  readonly DATE_MAP = {
    'created_at': 'Create Date',
    'updated_at': 'Last Modified',
    'accessed_date': 'Last Opened'
  };

  data$: Observable<any[]>;
  context;
  next: string;
  menuActions = {
    share: {
      active: true,
      icon: 'fa fa-share-alt',
      text: this.tooltip.share,
      action: 'share'
    },
    favorite: {
      active: true,
      icon: 'fa fa-star-o',
      text: this.tooltip.favourite,
      action: 'favorite'
    },
    delete: {
      active: true,
      icon: 'fa fa-trash-o',
      text: this.tooltip.delete,
      action: 'delete'
    }
  };

  otherActions = {
    edit: {
      active: true,
      icon: 'fa fa-pencil',
      text: 'Edit',
      action: 'edit'
    },
    move_to_folder: {
      active: true,
      icon: 'fa fa-download',
      text: 'Move to folder',
      action: 'move_to_folder'
    },
    make_copy: {
      active: true,
      icon: 'fa fa-files-o',
      text: 'Make copy',
      action: 'make_copy'
    },
    find_folder: {
      active: false,
      icon: 'fa fa-map-marker',
      text: 'Go to location',
      action: 'find_folder'
    },
    divider: {
      active: false,
      divider: true,
      action: ''
    },
    print: {
      active: false,
      icon: 'fa fa-print',
      text: 'Print',
      action: 'print'
    },
    export_to_pdf: {
      active: false,
      icon: 'fa fa-cloud-download',
      text: 'Export to PDF',
      action: 'export_to_pdf'
    }
  };
  noOtherActions = false;

  private destroySubject: Subject<any> = new Subject<any>();

  constructor(
    private noteService: ZNoteService,
    private route: ActivatedRoute,
    private router: Router,
    private wthConfirmService: WthConfirmService,
    private apiBaseService: ApiBaseService,
    private commonEventService: CommonEventService,
    private wthConfirm: WthConfirmService,
    private store: Store<any>
  ) {
    this.data$ = this.store.select(listReducer.getAllItems);
    this.store.select('context').pipe(takeUntil(this.destroySubject))
      .subscribe(context => this.context = context);
  }

  ngOnInit() {
    // File does not exist
    this.route.queryParams.subscribe((params: any) => {
      if (params.error === 'file_does_not_exist') {
        this.wthConfirmService.confirm({
          message:
            'You are in deleted note or invalid permission',
          header: 'Note not found',
          rejectLabel: null,
          accept: () => {
            this.router.navigate(['my-note']);
          },
          reject: () => {
            this.router.navigate(['my-note']);
          }
        });
      }
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.complete();
  }

  validatePermission() {
    if (!this.dataView) {
      return;
    }
    const objects: any[] = this.selectedObjects;
    const path = this.router.url;

    /*====================================
    [Permission] validate
    ====================================*/
    // const permissonValidateObjects = (action, objs) => {
    //   // check permission in each objects
    //   objs.map((object: any) => {
    //     // if permission is view turn off all acions edit
    //     if (
    //       object.permission === 'view' &&
    //       (action.needPermission === 'edit' || action.needPermission === 'owner')
    //     ) {
    //       action.active = false;
    //     }
    //     if (object.permission === 'edit' && action.needPermission === 'owner') {
    //       action.active = false;
    //     }
    //   });
    // };
    // Object.keys(this.otherActions).map((action: any) =>
    //   permissonValidateObjects(this.otherActions[action], objects)
    // );


    /*====================================
    [Path And Page] validate (shared-with-me, shared-by-me)
    ====================================*/
    if (['/recent', '/shared-by-me'].includes(path) && objects.length === 1) {
      this.otherActions['find_folder'].active = true;
    } else {
      this.otherActions['find_folder'].active = false;
    }

    /*====================================
    [Objects_Number] validate
    ====================================*/
    if (objects.length > 1) {
      this.otherActions.edit.active = false;
    } else if (objects.length === 1) {
      if (objects[0].permission === 'view') {
        this.otherActions.edit.active = false;
      } else {
        this.otherActions.edit.active = true;
        this.otherActions.edit.text = objects[0].object_type === OBJECT_TYPE.FOLDER ? 'Rename' : 'Edit';
      }
    }

    /*====================================
    [Objects_Type] validate
    ====================================*/
    const folderSelected = objects.some((obj: any) =>
      obj.object_type === OBJECT_TYPE.FOLDER
    );
    this.otherActions['make_copy'].active = !folderSelected;
    this.otherActions['export_to_pdf'].active = !folderSelected && objects.length === 1;

    this.otherActions['divider'].active = (this.otherActions['print'].active || this.otherActions['export_to_pdf'].active);

    // Disable all actions except favourite and remove actions if selected objects belongs to 2 different users
    const userSet = objects.reduce((acc, obj) => acc.add(obj.user.id), new Set());
    if (userSet.size > 1) {
      this.menuActions.share.active = false;
      Object.keys(this.otherActions).forEach(action => this.otherActions[action].active = false);
      this.noOtherActions = true;
      return;
    } else {
      this.menuActions.share.active = true;
      this.noOtherActions = false;
    }

  }

  onNewNote() {
    this.noteService.modalEvent({ action: 'note:open_note_add_modal' });
  }

  onFolder() {
    this.noteService.modalEvent({
      action: 'note:folder:create'
    });
  }

  onBreadcrumbAction(event: any) {
    this.noteService.modalEvent({
      action: event.action,
      payload: event.payload,
      breadcrumb: true
    });
  }

  onDblClick(event) {
    this.dataView.container.clearSelection();
    switch (event.object_type) {
      case OBJECT_TYPE.NOTE: {
        this.noteService.modalEvent({
          action: 'note:open_note_edit_modal',
          payload: event
        });
        break;
      }
      case OBJECT_TYPE.FOLDER: {
        this.router.navigate([
          'folders',
          event.id
        ]);
        break;
      }
    }
  }

  onMenuAction(action: string) {
    const selectedObjects = this.selectedObjects;
    switch (action) {
      case 'share': {
        if (selectedObjects.length > 0) {
          this.commonEventService.broadcast({
            channel: 'noteActionsBar',
            action: 'note:mixed_entity:open_sharing_modal',
            payload: selectedObjects
          });
        }
        break;
      }
      case 'favorite': {
        this.apiBaseService
          .post('note/mixed_entities/favourites', { objects: selectedObjects })
          .subscribe((res: any) => {
            this.store.dispatch(new note.MultiNotesUpdated(res.data));
            this.updateMenuFavorite(_.every(res.data, 'favorite'));
          });
        break;
      }
      // Delete or Remove objects
      case 'delete': {
        const deleteObjects = selectedObjects.filter(
          (object: any) => object.permission === 'owner'
        );
        const removeObjects = selectedObjects.filter(
          (object: any) => object.permission !== 'owner'
        );
        if (deleteObjects.length > 0) {
          this.commonEventService.broadcast({
            channel: 'noteActionsBar',
            action: 'note:note_edit:close',
            payload: deleteObjects
          });
          this.commonEventService.broadcast({
            channel: 'noteActionsBar',
            action: 'note:mixed_entity:delete',
            payload: deleteObjects
          });
        }
        if (removeObjects.length > 0) {
          this.store.dispatch({
            type: note.REMOVE_SHARE_WITH_ME,
            payload: removeObjects
          });
        }
        break;
      }
      case 'edit': {
        if (selectedObjects.length > 0) {
          const selectedObject = selectedObjects[0];
          this.dataView.clearSelection();
          switch (selectedObject.object_type) {
            case OBJECT_TYPE.NOTE:
              this.noteService.modalEvent({
                action: 'note:open_note_edit_modal',
                payload: selectedObject
              });
              break;
            case OBJECT_TYPE.FOLDER:
              this.commonEventService.broadcast({
                channel: 'noteActionsBar',
                action: 'note:folder:edit',
                payload: selectedObject
              });
              break;
          }
        }
        break;
      }
      case 'find_folder': {
        const obj = selectedObjects[0];
        const parentPath: string =
          obj.permission === 'owner' ? '/my-note' : '/shared-with-me';
        const path: string = obj.parent_id
          ? `${parentPath}/folders/${obj.parent_id}`
          : parentPath;
        this.commonEventService.broadcast({
          channel: 'noteLeftMenu',
          action: 'expanded',
          payload: []
        });
        this.router.navigate([path]);
        break;
      }
      case 'move_to_folder': {
        this.commonEventService.broadcast({
          channel: 'noteActionsBar',
          action: 'note:mixed_entity:open_move_to_folder_modal',
          payload: selectedObjects
        });
        break;
      }
      case 'stop_sharing': {
        this.wthConfirm.confirm({
          message:
            'Are you sure stop share item(s). After pressing Remove, selected item(s) will disappear on this page.',
          header: 'Remove',
          accept: () => {
            this.store.dispatch({
              type: note.REMOVE_SHARE_WITH_ME,
              payload: selectedObjects
            });
          }
        });
        break;
      }
      case 'make_copy': {
        this.commonEventService.broadcast({
          channel: 'noteActionsBar',
          action: 'note:mixed_entity:make_a_copy',
          payload: selectedObjects
        });
        break;
      }
      case 'print': {
        if (selectedObjects.length > 0) {
          this.commonEventService.broadcast({
            channel: 'noteActionsBar',
            action: 'note:note_edit:print',
            payload: selectedObjects
          });
        }
        break;
      }
      case 'export_to_pdf': {
        if (selectedObjects.length > 0) {
          this.commonEventService.broadcast({
            channel: 'noteActionsBar',
            action: 'note:note_edit:export_pdf',
            payload: selectedObjects
          });
        }
        break;
      }
      default: {
        console.warn('unhandled action: ', action);
      }
    }
  }


  async getDataAsync() {
    // const data = await this.dataService.getData(this.next).toPromise();
    // this.next = data.meta.links.next;
  }

  onLoadMoreCompleted(event: any) {
    if (event && this.next) {
      this.getDataAsync().then();
    }
  }

  onSortComplete(event: any) {
    if (!this.enableSort) return;
    const sortOption: SortOption = { field: event.sortBy.toLowerCase(), desc: event.orderBy === 'desc' };
    this.store.dispatch({
      type: contextReducer.SET_CONTEXT,
      payload: {
        sort: sortOption
      }
    });
  }

  onViewComplete(event: any) {
    this.store.dispatch({
      type: contextReducer.SET_CONTEXT,
      payload: {
        viewMode: event
      }
    })
    this.dataView.container.update();
    this.dataView.updateView();
  }

  onSelectCompleted() {

    // update icon favorite
    this.updateMenuFavorite(_.every(this.selectedObjects, 'favorite'));

    // check menu view
    this.validatePermission();
  }

  private get selectedObjects() {
    if (this.dataView) {
      return this.dataView.selectedObjects;
    }
    return [];
  }

  private updateMenuFavorite(isFavorite: boolean) {
    this.menuActions['favorite'].icon = isFavorite ? 'fa fa-star' : 'fa fa-star-o';
  }
}
