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
import { Router } from '@angular/router';

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
  @Input() page: any;
  @Input() subPage: any;
  @Input() selectedObjects: any[] = [];
  @Input() permission: any = 'edit';
  @Input() detectChange: boolean;
  @Input() toolbarPosition: any = 'top';

  readonly tooltip: any = Constants.tooltip;
  show: boolean = true;
  destroySubject: Subject<any> = new Subject<any>();
  urls: any;
  disableDropDown: any = false;

  actionsMenu: any = {
    favourite: {
      show: true,
      needPermission: 'view',
      inDropDown: false, // Outside dropdown list
      action: this.favourite.bind(this),
      class: 'btn btn-default',
      tooltip: this.tooltip.favourite,
      tooltipPosition: 'bottom',
      title: 'Favourite',
      iconClass: 'fa fa-star'
    },
    share: {
      show: true,
      needPermission: 'owner',
      inDropDown: false, // Outside dropdown list
      action: this.share.bind(this),
      class: 'btn btn-default',
      tooltip: this.tooltip.share,
      tooltipPosition: 'bottom',
      iconClass: 'fa fa-share-alt'
    },
    delete: {
      show: true,
      needPermission: 'view',
      inDropDown: false, // Outside dropdown list
      action: this.deleteOrRemove.bind(this),
      class: 'btn btn-default',
      tooltip: this.tooltip.remove,
      tooltipPosition: 'bottom',
      title: 'Remove',
      iconClass: 'fa fa-trash-o'
    },
    edit: {
      show: true,
      needPermission: 'edit',
      inDropDown: true, // Inside dropdown list
      action: this.edit.bind(this),
      title: 'Edit'
    },
    copy: {
      show: true,
      needPermission: 'edit',
      inDropDown: true, // Inside dropdown list
      action: this.makeACopy.bind(this),
      title: 'Make copy'
    },
    findFolder: {
      show: true,
      needPermission: 'view',
      inDropDown: true, // Inside dropdown list
      action: this.findFolder.bind(this),
      title: 'Find folder'
    },
    moveToFolder: {
      show: true,
      needPermission: 'owner',
      inDropDown: true, // Inside dropdown list
      action: this.moveToFolder.bind(this),
      title: 'Move to folder'
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
              private router: Router,
              public commonEventService: CommonEventService) {
    // this.selectedObjects$ = this.store.select(fromRoot.getSelectedObjects);
  }

  ngOnInit() {
    // Inline toolbar only
    this.validatePermission(this.selectedObjects);
    this.commonEventService.filter((e: any) => e.channel == 'noteActionsBar' && this.toolbarPosition == 'top').subscribe((e: any) => {
      if(e.action == 'note:toolbar_change') { this.validatePermission(this.selectedObjects); }
    })
  }

  validatePermission(objects) {
    this.urls = this.urlService.parse();

    /*====================================
    [Permission] validate
    ====================================*/
    let permissonValidateObjects = (action, objects) => {
      // check permission in each objects
      objects.map((object: any) => {
        // if permission is view turn off all acions edit
        if(object.permission == 'view' && (action.needPermission == 'edit' || action.needPermission == 'owner')) {
          action.show = false;
        }
        if(object.permission == 'edit' && action.needPermission == 'owner') {
          action.show = false;
        }
      })
    }
    Object.keys(this.actionsMenu).map((action: any) => permissonValidateObjects(this.actionsMenu[action], objects));

    /*====================================
    [Path And Page] validate (shared-with-me, shared-by-me)
    ====================================*/
    let pathValidate = (action, currentPath) => {
      // ==================
      if(currentPath != 'shared-by-me' && action.title == 'Stop Sharing') {
        action.show = false;
      }
<<<<<<< HEAD
      if(currentPath == 'shared-by-me' && this.page == noteConstants.PAGE_SHARED_BY_ME && action.title == 'Make copy') {
        action.show = false;
      }
      if(currentPath == 'shared-with-me' && this.page == noteConstants.PAGE_SHARED_WITH_ME && action.title == 'Make copy') {
        action.show = false;
      }
      if(![noteConstants.PAGE_RECENT, noteConstants.PAGE_NOTE_FAVOURITE ].includes(this.page) && action.title == 'Find folder') {
        action.show = false;
      }
=======
      // if(currentPath == 'shared-by-me' && this.page == noteConstants.PAGE_SHARED_BY_ME && action.title == 'Make copy') {
      //   action.show = false;
      // }
      // if(currentPath == 'shared-with-me' && this.page == noteConstants.PAGE_SHARED_WITH_ME && action.title == 'Make copy') {
      //   action.show = false;
      // }
>>>>>>> cc69e9f... add: note action messages
      // ==================
      if(this.subPage == noteConstants.PAGE_NOTE_EDIT && (action.title == 'Edit')) {
        action.show = false;
      }
      if(this.subPage !== noteConstants.PAGE_NOTE_EDIT && (action.title == 'Print')) {
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
    let objectTypeValidateObjects = (action, objects) => {
      objects.map((object: any) => {
        if (object.object_type == 'folder' && (action.title == 'Make copy' || action.title == 'Export as PDF'))
          action.show = false;
      })
    }
    Object.keys(this.actionsMenu).map((action: any) => objectTypeValidateObjects(this.actionsMenu[action], objects));

    /*====================================
    [Favourite] validate
    ====================================*/
    let allFavorite: any = true;
    let permissonValidateFavourites = (action, objects) => {
      // check Favourite in each objects
      objects.map((object: any) => {
        if (action.title == 'Favourite') {
          if (!object.favourite) {
            action.iconClass = 'fa fa-star-o'
            allFavorite = false;
          }
        }
      });
    }
    if (allFavorite) this.actionsMenu.favourite.iconClass = 'fa fa-star'
    Object.keys(this.actionsMenu).map((action: any) => permissonValidateFavourites(this.actionsMenu[action], objects));
    // After All
    this.disableDropDown = true;
    for(let key of Object.keys(this.actionsMenu)) {
      if (this.actionsMenu[key].inDropDown && this.actionsMenu[key].show) this.disableDropDown = false;
    }
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

  deleteOrRemove() {
    let deleteObjects = this.selectedObjects.filter((object: any) => object.permission == 'owner');
    let removeObjects = this.selectedObjects.filter((object: any) => object.permission !== 'owner');
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
      this.store.dispatch({type: note.REMOVE_SHARE_WITH_ME, payload: removeObjects});
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

  findFolder() {
    console.debug('inside Find Folder', this.selectedObjects);
    let obj: any = this.selectedObjects[0];
    let parentPath: string = (obj.permission == 'owner') ? '/my-note' : '/shared-with-me';
    let path: string = obj.parent_id ? `${parentPath}/folders/${obj.parent_id}` : parentPath;
    this.router.navigate([path]);
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

  favourite() {
    let cb: any = () => {this.validatePermission(this.selectedObjects)}
    this.commonEventService.broadcast({
      channel: 'noteActionsBar',
      action: 'note:mixed_entity:favourite',
      payload: {objects: this.selectedObjects, callback: cb}
    });
  }
}
