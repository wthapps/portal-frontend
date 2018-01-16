import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges, OnDestroy } from '@angular/core';

import 'rxjs/add/operator/take';

import { Constants } from '@shared/constant/config/constants';
import { ZNoteService } from '../services/note.service';
import { CommonEventService } from '@shared/services/common-event/common-event.service';
import * as note from '../actions/note';
import * as context from '../reducers/context';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';
import { ApiBaseService } from '@shared/services/apibase.service';
import { Store } from '@ngrx/store';
import { Subject } from "rxjs";
import { UrlService } from "@shared/services";
import { NoteConstants, noteConstants } from "note/shared/config/constants";

declare var _: any;
declare let saveAs: any;
// declare let printJS: any;

@Component({
  selector: 'z-note-shared-actions-bar',
  templateUrl: 'actions-bar.component.html',
  styleUrls: ['actions-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ZNoteSharedActionBarComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: any;
  @Input() page: any;
  @Input() subPage: any;
  @Input() selectedObjects: any[] = [];
  @Input() permission: any = 'edit';

  readonly tooltip: any = Constants.tooltip;
  show: boolean = true;
  toolbarPosition: any = 'top'; // 2 positions: top and inline
  destroySubject: Subject<any> = new Subject<any>();
  urls: any;

  actionsMenu: any = {
    edit: {
      show: true,
      needPermission: 'edit',
      inDropDown: false, // Outside dropdown list
      action: this.edit.bind(this),
      class: 'btn btn-default',
      tooltip: this.tooltip.edit,
      tooltipPosition: 'bottom',
      title: 'Edit',
      iconClass: 'fa fa-pencil'
    },
    share: {
      show: true,
      needPermission: 'edit',
      inDropDown: false, // Outside dropdown list
      action: this.share.bind(this),
      class: 'btn btn-default',
      tooltip: this.tooltip.share,
      tooltipPosition: 'bottom',
      iconClass: 'fa fa-share-alt'
    },
    delete: {
      show: true,
      needPermission: 'owner',
      inDropDown: false, // Outside dropdown list
      action: this.delete.bind(this),
      class: 'btn btn-default',
      tooltip: this.tooltip.delete,
      tooltipPosition: 'bottom',
      title: 'Delete',
      iconClass: 'fa fa-trash-o'
    },
    copy: {
      show: true,
      needPermission: 'edit',
      inDropDown: true, // Inside dropdown list
      action: this.makeACopy.bind(this),
      title: 'Make copy'
    },
    moveToFolder: {
      show: true,
      needPermission: 'edit',
      inDropDown: true, // Inside dropdown list
      action: this.moveToFolder.bind(this),
      title: 'Move to folder'
    },
    removeSharedWithMe: {
      show: true,
      needPermission: 'view',
      inDropDown: true, // Inside dropdown list
      action: this.removeShares.bind(this),
      title: 'Remove Share'
    },
    removeMixing: {
      show: true,
      needPermission: 'view',
      inDropDown: true, // Inside dropdown list
      action: this.removeMixing.bind(this),
      title: 'Remove'
    },
    print: {
      show: true,
      needPermission: 'view',
      inDropDown: true, // Inside dropdown list
      action: this.print.bind(this),
      title: 'Print'
    },
    exportPdf: {
      show: true,
      needPermission: 'view',
      inDropDown: true, // Inside dropdown list
      action: this.exportPdf.bind(this),
      title: 'Export as PDF'
    },
    stopSharing: {
      show: true,
      needPermission: 'edit',
      inDropDown: true, // Inside dropdown list
      action: this.stopSharing.bind(this),
      title: 'Stop Sharing'
    }
  }

  constructor(public noteService: ZNoteService,
              private wthConfirm: WthConfirmService,
              private urlService: UrlService,
              private store: Store<any>,
              private api: ApiBaseService,
              public commonEventService: CommonEventService) {
    // this.selectedObjects$ = this.store.select(fromRoot.getSelectedObjects);
  }

  ngOnInit() {
    // Inline toolbar only
    if (this.data) {
      this.validatePermission([this.data]);
    }
  }

  validatePermission(objects) {
    this.urls = this.urlService.parse();

    /*====================================
    [Permission] validate
    ====================================*/
    let permissonValidateOneObject = (action, permissiOnObject) => {
      // if permission is view turn off all acions edit
      if(permissiOnObject == 'view' && (action.needPermission == 'edit' || action.needPermission == 'owner')) {
        action.show = false;
      }
      if(permissiOnObject == 'edit' && action.needPermission == 'owner') {
        action.show = false;
      }
    }
    let permissonValidateObjects = (action, objects) => {
      // check permission in each objects
      objects.map((object: any) => permissonValidateOneObject(action, object.permission))
    }
    Object.keys(this.actionsMenu).map((action: any) => permissonValidateObjects(this.actionsMenu[action], objects));

    /*====================================
    [Path And Page] validate (shared-with-me, shared-by-me)
    ====================================*/
    let pathValidate = (action, currentPath) => {
      if(currentPath != 'shared-with-me' && action.title == 'Remove Share') {
        action.show = false;
      }
      // ==================
      if(currentPath != 'shared-by-me' && action.title == 'Stop Sharing') {
        action.show = false;
      }
      if(currentPath == 'shared-by-me' && this.page == noteConstants.PAGE_SHARED_BY_ME && action.title == 'Make copy') {
        action.show = false;
      }
      // ==================
      if(this.subPage == noteConstants.PAGE_NOTE_EDIT && (action.title == 'Edit')) {
        action.show = false;
      }
      if(this.subPage !== noteConstants.PAGE_NOTE_EDIT && (action.title == 'Print' || action.title == 'Export as PDF')) {
        action.show = false;
      }
      if(this.page !== noteConstants.PAGE_RECENT && action.title == 'Remove') {
        action.show = false;
      }
    }
    Object.keys(this.actionsMenu).map((action: any) => pathValidate(this.actionsMenu[action], this.urls.paths[0]));

    /*====================================
    [Objects_Number] validate
    ====================================*/
    if (objects.length > 1) {
      this.actionsMenu.edit.show = false;
    }

    /*====================================
    [Objects_Type] validate
    ====================================*/
    let objectTypeValidateOneObject = (action, object) => {
      if (object.object_type == 'folder' && action.title == 'Make copy') action.show = false;
    }
    let objectTypeValidateObjects = (action, objects) => {
      objects.map((object: any) => objectTypeValidateOneObject(action, object))
    }
    Object.keys(this.actionsMenu).map((action: any) => objectTypeValidateObjects(this.actionsMenu[action], objects));
  }

  ngOnDestroy() {
    if (this.destroySubject) {this.destroySubject.next(''); this.destroySubject.unsubscribe();}
  }

  ngOnChanges(e: any) {
    // setup toolbar (position, show or not)
    this.toolbarSetup(e);
    // On Off toolbar menu actions
    this.toolbarActionsSetup(e);
  }

  toolbarSetup(e: any) {
    // set toolbar Position
    if(this.data) {
      this.toolbarPosition = 'inline';
    } else {
      this.toolbarPosition = 'top';
    }
    // show toolbar or not, toolbar top only
    // console.log(e)
    if(this.selectedObjects.length < 1 && this.toolbarPosition == 'top') {
      this.show = false;
    } else {
      this.show = true;
    }
  }

  toolbarActionsSetup(e: any) {
    // Turn on action before validate
    Object.keys(this.actionsMenu).map((action: any) => this.actionsMenu[action].show = true);
    this.validatePermission(this.selectedObjects);
  }

  stopSharing() {
    this.wthConfirm.confirm({
      message: 'Are you sure stop share item(s). After pressing Remove, selected item(s) will disappear on this page.',
      header: 'Remove',
      accept: () => {
        this.store.dispatch({type: note.REMOVE_SHARE_WITH_ME, payload: this.selectedObjects})
      }
    })
  }

  delete() {
    if (this.selectedObjects.length > 0) {
      this.commonEventService.broadcast({
        channel: 'noteActionsBar',
        action: 'note:note_edit:close',
        payload: this.selectedObjects
      });
      this.commonEventService.broadcast({
        channel: 'noteActionsBar',
        action: 'note:mixed_entity:delete',
        payload: this.selectedObjects
      });
    }
  }

  share() {
    if (this.selectedObjects.length > 0) {
      this.commonEventService.broadcast({
        channel: 'noteActionsBar',
        action: 'note:mixed_entity:open_sharing_modal',
        payload: this.selectedObjects
      });
    }
  }

  print() {
    if (this.selectedObjects.length > 0) {
      this.commonEventService.broadcast({
        channel: 'noteActionsBar',
        action: 'note:note_edit:print',
        payload: this.selectedObjects
      });
    }
  }

  exportPdf() {
    if (this.selectedObjects.length > 0) {
      this.commonEventService.broadcast({
        channel: 'noteActionsBar',
        action: 'note:note_edit:export_pdf',
        payload: this.selectedObjects
      });
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

  moveToFolder() {
    this.commonEventService.broadcast({
      channel: 'noteActionsBar',
      action: 'note:mixed_entity:open_move_to_folder_modal',
      payload: this.selectedObjects
    });
  }

  makeACopy() {
    this.commonEventService.broadcast({
      channel: 'noteActionsBar',
      action: 'note:mixed_entity:make_a_copy',
      payload: this.selectedObjects
    });
  }

  removeShares() {
    this.wthConfirm.confirm({
      message: 'Are you sure to remove selected item(s) from Share with me page. After pressing Remove, selected item(s) will disappear on this page.',
      header: 'Remove',
      accept: () => {
        this.store.dispatch({type: note.REMOVE_SHARE_WITH_ME, payload: this.selectedObjects})
      }
    })
  }

  removeMixing() {

  }
}
