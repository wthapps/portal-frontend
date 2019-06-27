import { Component, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../reducers/index';

import { BsModalComponent } from 'ng2-bs3-modal';
import { CommonEventService } from '@shared/services/common-event/common-event.service';
import { ApiBaseService } from '@shared/services/apibase.service';
import { Note } from '@shared/shared/models/note.model';

declare var $: any;
declare var _: any;

@Component({
  selector: 'z-note-shared-modal-folder-move',
  templateUrl: 'move.component.html',
  styleUrls: ['move.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ZNoteSharedModalFolderMoveComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;

  titleModal = 'Move to Folder';
  menuItems: any = [];
  rootFolder: Note;
  listFolder: Note[] = null;

  form: FormGroup;
  name: AbstractControl;
  folder: any = null;
  currentFolder: any = null;
  selectedObjects: any = [];

  private breadscrumb: boolean;

  constructor(private fb: FormBuilder,
              private commonEventService: CommonEventService,
              private apiBaseService: ApiBaseService,
              private store: Store<fromRoot.State>) {
    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required])]
    });

    this.name = this.form.controls['name'];
  }

  ngOnInit(): void {
    this.apiBaseService.get(`note/folders`).subscribe((event: any) => {
      for (const folder of event.data) {
        if (this.folder && this.folder.id === folder.id) {
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

  open(breadcrumb: boolean = false) {
    this.folder = null;
    this.breadscrumb = breadcrumb;
    this.modal.open();
  }

  loadMenu(event: any) {
    event.originalEvent.stopPropagation();

    const htmlTarget: any = event.originalEvent.target;
    if ($(htmlTarget).hasClass('fa-caret-right') || $(htmlTarget).hasClass('fa-caret-down')) {
      if (event.item.expanded) {
        this.apiBaseService.get(`note/folders/${event.item.id}`).subscribe((res: any) => {
          event.item.items.length = 0;
          for (const folder of res.data) {
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
    let path = `note/folders/${item.id}`;

    if (setFolder) {
      if (this.selectedObjects[0].parent_id === item.id) {
        this.folder = null;
      } else {
        this.folder = item;
      }
    } else {
      // if modal is opened from breadscrumb then update path to query folders
      if (this.breadscrumb) {
        path = item.parent_id ? `note/folders/${ item.parent_id }`: `note/folders`
      }
    }

    this.apiBaseService.get(path).subscribe(
      (res: any) => {
        this.rootFolder = res.parent;
        this.listFolder = res.data;
      });
  }

  prevFolder(item: any) {
    this.folder = item;

    if (item.parent_id) {
      this.apiBaseService.get(`note/folders/${item.parent_id}`).subscribe(
        (res: any) => {
          this.rootFolder = res.parent;
          this.listFolder = res.data;
        });
    } else {
      if (!this.selectedObjects[0].parent_id) {
        this.folder = null;
      } else {
        this.folder = { id: null }; // my notes
      }
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
    console.log('choose folder', item, this.selectedObjects[0]);

    if (this.selectedObjects[0].parent_id === item.id) {
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
