import { reducers } from './../reducers/index';
import { ApiBaseService } from './../../../shared/services/apibase.service';
import { Component, HostBinding, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ZNoteService } from '../services/note.service';
import { Store } from '@ngrx/store';
import * as listReducer from '../reducers/features/list-mixed-entities';
import { Observable } from 'rxjs';


import { ActivatedRoute, Router } from '@angular/router';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';
import { WDataViewComponent } from "../../../sample/shared/components/w-dataView/w-dataView.component";
import { Constants } from "@shared/constant";
import { noteConstants } from '../config/constants';
import * as note from '../actions/note';
import { CommonEventService } from '@shared/services';

declare var _: any;
const OBJECT_TYPE = noteConstants.OBJECT_TYPE;
@Component({
  selector: 'z-note-container',
  templateUrl: 'note-container.component.html',
  styleUrls: ['note-container.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZNoteContainerComponent implements OnInit {
  @Input() breadcrumbs: any;
  @HostBinding('class') class = 'main-page-body';
  @ViewChild('dataView') dataView: WDataViewComponent;

  tooltip: any = Constants.tooltip;
  data$: Observable<any[]>;
  next: string;
  menuActions = [
    {
      active: true,
      icon: 'fa fa-share-alt',
      text: this.tooltip.share,
      action: 'share'
    },
    {
      active: true,
      icon: 'fa fa-star-o',
      text: this.tooltip.favourite,
      action: 'favorite'
    },
    {
      active: true,
      icon: 'fa fa-trash-o',
      text: this.tooltip.delete,
      action: 'delete'
    }
  ];

  otherActions = [
    {
      active: true,
      icon: 'fa fa-pencil',
      text: 'Edit',
      action: 'edit'
    },
    {
      active: true,
      icon: 'fa fa-download',
      text: 'Move to folder',
      action: 'move_to_folder'
    },
    {
      active: true,
      icon: 'fa fa-pencil',
      text: 'Rename',
      action: 'rename'
    },
    {
      active: true,
      icon: 'fa fa-files-o',
      text: 'Make copy',
      action: 'make_copy'
    },
    {
      active: true,
      icon: 'fa fa-print',
      text: 'Print',
      action: 'print'
    },
    {
      active: true,
      icon: 'fa fa-cloud-download',
      text: 'Export to PDF',
      action: 'export_to_pdf'
    }
  ];

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

  onNewNote() {
    this.noteService.modalEvent({action: 'note:open_note_add_modal'});
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
    const selectedObjects = this.dataView.selectedDocuments;
    const objects = this.dataView.selectedDocuments.map(({id, object_type, favourite}) => ({id, object_type, favourite}));
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
          .post('note/mixed_entities/favourites', {objects: objects})
          .subscribe((res: any) => {
            // this.selectedObjects = res.data;
            // this.validatePermission(this.selectedObjects);
            this.store.dispatch(new note.MultiNotesUpdated(res.data));
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
          switch (selectedObject.object_type) {
            case 'Note::Note':
              this.noteService.modalEvent({
                action: 'note:open_note_edit_modal',
                payload: selectedObject
              });
              break;
            case 'Note::Folder':
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
        this.store.dispatch({
          type: note.SELECT_ONE,
          payload: obj
        });
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
      case 'rename': {
      // Apply for folder objects only
        if (selectedObjects.length === 1 && selectedObjects[0].object_type === OBJECT_TYPE.FOLDER) {
          this.commonEventService.broadcast({
            channel: 'noteActionsBar',
            action: 'note:folder:edit',
            payload: selectedObjects[0]
          });

        }
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

  // constructor(private dataService: NoteService) {
  //   this.data$ = this.dataService.data$;
  // }

  // ngOnInit(): void {
  //   this.getDataAsync().then();
  // }

  async getDataAsync() {
    // const data = await this.dataService.getData(this.next).toPromise();
    // this.next = data.meta.links.next;
  }

  onLoadMoreCompleted(event: any) {
    if (event && this.next) {
      this.getDataAsync().then();
    }
  }

  async onSortComplete(event: any) {
    // console.log(event);
    // const data = await this.dataService.sort(event).toPromise();
    // this.next = data.meta.links.next;
  }

  onViewComplete(event: any) {
    this.dataView.viewMode = event;
    this.dataView.container.update();
    this.dataView.updateView();
  }

  onSelectCompleted() {

    // update icon favorite
    this.updateMenuFavorite(_.every(this.dataView.selectedDocuments, 'favorite'));

    // check menu view
    const otherActionsEdit = _.find(this.otherActions, ['action', 'edit']);
    otherActionsEdit.active = !(this.dataView.selectedDocuments.length > 1);
  }

  private updateMenuFavorite(isFavorite: boolean) {
    const menuActionsIndex = this.menuActions.findIndex(x => x.action === 'favorite');
    this.menuActions[menuActionsIndex].icon = isFavorite ? 'fa fa-star' : 'fa fa-star-o';
  }
}
