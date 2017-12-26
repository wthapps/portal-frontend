import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges, OnDestroy } from '@angular/core';

import 'rxjs/add/operator/take';

import { Constants } from '@shared/constant/config/constants';
import { ZNoteService } from '../services/note.service';
import { CommonEventService } from '@shared/services/common-event/common-event.service';
import * as note from '../actions/note';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';
import { ApiBaseService } from '@shared/services/apibase.service';
import { Store } from '@ngrx/store';
import { Subject } from "rxjs";

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
  @Input() selectedObjects: any[] = [];

  readonly tooltip: any = Constants.tooltip;
  permission: any = 'edit';
  show: boolean = true;
  toolbarPosition: any = 'top'; // 2 positions: top and inline
  destroySubject: Subject<any> = new Subject<any>();

  actionsMenu: any = {
    edit: {
      show: true,
      permission: 'edit',
      inDropDown: false, // Outside dropdown list
      action: this.edit.bind(this),
      class: 'btn btn-default',
      tooltip: this.tooltip.edit,
      tooltipPosition: 'bottom',
      iconClass: 'fa fa-pencil'
    },
    share: {
      show: true,
      permission: 'edit',
      inDropDown: false, // Outside dropdown list
      action: this.share.bind(this),
      class: 'btn btn-default',
      tooltip: this.tooltip.share,
      tooltipPosition: 'bottom',
      iconClass: 'fa fa-share-alt'
    },
    delete: {
      show: true,
      permission: 'edit',
      inDropDown: false, // Outside dropdown list
      action: this.delete.bind(this),
      class: 'btn btn-default',
      tooltip: this.tooltip.delete,
      tooltipPosition: 'bottom',
      iconClass: 'fa fa-trash-o'
    },
    copy: {
      show: true,
      permission: 'edit',
      inDropDown: true, // Inside dropdown list
      action: this.makeACopy.bind(this),
      title: 'Make copy'
    },
    moveToFolder: {
      show: true,
      permission: 'edit',
      inDropDown: true, // Inside dropdown list
      action: this.moveToFolder.bind(this),
      title: 'Move to folder'
    },
    removeSharedWithMe: {
      show: true,
      permission: 'view',
      inDropDown: true, // Inside dropdown list
      action: this.removeShares.bind(this),
      title: 'Remove Share'
    },
    stopSharing: {
      show: true,
      permission: 'edit',
      inDropDown: true, // Inside dropdown list
      action: this.stopSharing.bind(this),
      title: 'Stop Sharing'
    }
  }

  constructor(public noteService: ZNoteService,
              private wthConfirm: WthConfirmService,
              private store: Store<any>,
              private api: ApiBaseService,
              public commonEventService: CommonEventService) {
    // this.selectedObjects$ = this.store.select(fromRoot.getSelectedObjects);
  }

  ngOnInit() {
    //
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
    // turn on off action by permission for action
    if(this.selectedObjects[0] && this.selectedObjects[0].permission && this.selectedObjects[0].permission == 'view') {
      this.permission = 'view';
      for (let key in this.actionsMenu) {
        if (this.actionsMenu[key].permission == 'view') {
          this.actionsMenu[key].show = true;
        } else {
          this.actionsMenu[key].show = false;
        }
      }
    } else {
      for (let key in this.actionsMenu) {
        if (this.actionsMenu[key].permission == 'edit') {
          this.actionsMenu[key].show = true;
        } else {
          this.actionsMenu[key].show = false;
        }
      }
    }

    // show edit?: actions toolbar on top only
    if(this.selectedObjects.length > 1) {
      this.actionsMenu.edit.show = false;
    } else {
      this.actionsMenu.edit.show = true;
    }

    // show make a copy?
    let changed: boolean = false;
    _.forEach(this.selectedObjects, (item: any) => {
      if (item.object_type == 'folder') {
        this.actionsMenu.copy.show = false;
        changed = true;
      }
    });
    if(!changed) this.actionsMenu.copy.show = true;

    // show stop sharing?
    if(this.page == 'SHARED_BY_ME') {
      this.actionsMenu.stopSharing.show = true;
    } else {
      this.actionsMenu.stopSharing.show = false;
    }

    // show remove share?
    if(this.page == 'SHARED_WITH_ME') {
      this.actionsMenu.removeSharedWithMe.show = true;
    } else {
      this.actionsMenu.removeSharedWithMe.show = false;
    }
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
    if (this.selectedObjects.length >= 1) {
      this.commonEventService.broadcast({
        channel: 'noteActionsBar',
        action: 'note:mixed_entity:delete',
        payload: this.selectedObjects
      });
    }
  }

  share() {
    // TODO: Share multiple folders and notes
    if (this.selectedObjects.length > 0) {
      this.commonEventService.broadcast({
        channel: 'noteActionsBar',
        action: 'note:mixed_entity:open_sharing_modal',
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

  pdfDownload() {
    let note = this.selectedObjects[0];
    this.api.download('note/notes/pdf_download/' + note.id).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/pdf'});
      saveAs(blob, note.title + '.pdf');
    })
  }

  print() {
    // let note = this.selectedObjects[0];
    // printJS({ printable: 'noteview', type: 'html', header: note.title});
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
}
