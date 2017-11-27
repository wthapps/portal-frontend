import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../shared/reducers/index';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { CommonEventService } from '../../../../core/shared/services/common-event/common-event.service';
import { ApiBaseService } from '../../../../core/shared/services/apibase.service';
import { Note } from '../../../../core/shared/models/note.model';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-note-shared-modal-folder-move',
  templateUrl: 'move.component.html',
  styleUrls: ['move.component.css']
})

export class ZNoteSharedModalFolderMoveComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;

  titleModal: string = 'Move to Folder';
  menuItems: any = [];
  rootFolder: Note;
  listFolder: Note[] = new Array<Note>();

  form: FormGroup;
  name: AbstractControl;
  folder: any = null;
  currentFolder: any = null;
  selectedObjects: any = [];

  constructor(private fb: FormBuilder,
              private commonEventService: CommonEventService,
              private apiBaseService: ApiBaseService,
              private store: Store<fromRoot.State>,) {
    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required])]
    });

    this.name = this.form.controls['name'];
  }

  ngOnInit(): void {
    this.apiBaseService.get(`note/folders`).subscribe((event: any) => {
      for (let folder of event.data) {
        if (this.folder && this.folder.id == folder.id) {
          continue;
        } else {
          folder.label = folder.name;
          folder.icon = 'fa-folder-o';
          folder.items = [];
          folder.command = (event: any) => this.loadMenu(event);
          this.menuItems.push(folder);
        }
      }
    });


    this.store.select(fromRoot.getCurrentFolder).subscribe(
      res => {
        if (res) {
          this.nextFolder(res, false);
        } else {
          this.initialMenu();
        }
      }
    );
  }

  open() {
    this.folder = null;
    this.modal.open();
  }

  loadMenu(event: any) {
    event.originalEvent.stopPropagation();

    let htmlTarget: any = event.originalEvent.target;
    if ($(htmlTarget).hasClass('fa-caret-right') || $(htmlTarget).hasClass('fa-caret-down')) {
      if (event.item.expanded) {
        this.apiBaseService.get(`note/folders/${event.item.id}`).subscribe((res: any) => {
          event.item.items.length = 0;
          for (let folder of res.data) {
            folder.label = folder.name;
            folder.icon = 'fa-folder-o';
            folder.styleClass = `js-note-folders-tree-${folder.id}`;
            folder.items = [];
            folder.command = (event: any) => this.loadMenu(event);
            event.item.items.push(folder);
          }
        });
      }
    } else {
      this.folder = event.item;
      event.item.expanded = !event.item.expanded;

      $(htmlTarget).closest('.well-folder-tree').find('a').removeClass('active');
      $(htmlTarget).closest('a').addClass('active');
    }
  }

  nextFolder(item: any, setFolder: boolean = true) {
    if(setFolder) {
      if(this.selectedObjects[0].parent_id == item.id) {
        this.folder = null;
      } else {
        this.folder = item;
      }
    }
    this.apiBaseService.get(`note/folders/${item.id}`).subscribe(
      (res: any) => {
        this.rootFolder = res.parent;
        this.listFolder = res.data;
      });
  }

  prevFolder(item: any) {
    if(this.selectedObjects[0].parent_id == item.id) {
      this.folder = null;
    } else {
      this.folder = item;
    }

    if (item.parent_id) {
      this.apiBaseService.get(`note/folders/${item.parent_id}`).subscribe(
        (res: any) => {
          this.rootFolder = res.parent;
          this.listFolder = res.data;
        });
    } else {
      this.folder = {id: null}; // my notes
      this.initialMenu();
    }
  }

  initialMenu() {
    this.apiBaseService.get(`note/folders`).subscribe(
      (res: any) => {
        this.rootFolder = null;
        this.listFolder = res.data;
      });
  }

  chooseFolder(item: any) {
    if(this.selectedObjects[0].parent_id == item.id) {
      this.folder = null;
    } else {
      this.folder = item;
    }
  }

  isCurrent(item: any) {
    return _.some(this.selectedObjects, { 'id': item.id });
  }

  onMove() {
    _.forEach(this.selectedObjects, (item: any) => {
      item.parent_old_id = item.parent_id;
      item.parent_id = this.folder.id;
    });
    this.commonEventService.broadcast({
      channel: 'noteActionsBar',
      action: 'note:mixed_entity:move_to_folder',
      payload: this.selectedObjects
    });
    this.folder = null;
    this.modal.close();
  }
}
