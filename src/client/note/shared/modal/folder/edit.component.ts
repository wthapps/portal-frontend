import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { CommonEventService } from '../../../../core/shared/services/common-event/common-event.service';
import { ApiBaseService } from '../../../../core/shared/services/apibase.service';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'z-note-shared-modal-folder-edit',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ZNoteSharedModalFolderEditComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;

  titleModal: string = 'New Folder';
  menuItems: any = [];

  form: FormGroup;
  name: AbstractControl;
  folder: any = {};

  constructor(private fb: FormBuilder, private commonEventService: CommonEventService, private apiBaseService: ApiBaseService) {
    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required])]
    });

    this.name = this.form.controls['name'];
  }

  ngOnInit(): void {
    this.apiBaseService.get(`note/folders`).subscribe((event: any) => {
      for (let folder of event.data) {
        folder.label = folder.name;
        folder.icon = 'fa-folder-o';
        folder.items = [];
        folder.command = (event: any)=> this.loadMenu(event)
        this.menuItems.push(folder);
      }
    });
  }

  open() {
    this.modal.open()
  }

  loadMenu(event: any) {
    event.originalEvent.stopPropagation();
    if (event.originalEvent.target.className == 'ui-menuitem-text') {
      this.folder.parent_id = event.item.id;
      event.item.expanded = false;
    } else {
      if (event.item.expanded) {
        this.apiBaseService.get(`note/folders/${event.item.id}`).subscribe((res: any) => {
          event.item.items.length = 0;
          for (let folder of res.data) {
            folder.label = folder.name;
            folder.icon = 'fa-folder-o';
            folder.items = [];
            folder.command = (event: any)=> this.loadMenu(event)
            event.item.items.push(folder);
          }
        });
      }
    }
  }


  onSubmit(value: any) {
    this.folder.name = value.name;
    if (this.folder.id) {
      this.apiBaseService.put('note/folders/' + this.folder.id, this.folder).subscribe((res: any) => {
        this.commonEventService.broadcast({channel: 'noteFolderEvent', action: 'updateFolders', payload: res.data})
        this.modal.close();
      });
    } else {
      this.apiBaseService.post('note/folders', this.folder).subscribe((res: any) => {
        this.commonEventService.broadcast({channel: 'noteFolderEvent', action: 'updateFolders', payload: res.data})
        this.modal.close();
      });
    }
  }
}
