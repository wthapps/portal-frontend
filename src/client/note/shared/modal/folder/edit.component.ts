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
  styleUrls: ['edit.component.css']
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
        if(this.folder && this.folder.id == folder.id) {
          continue;
        } else {
          folder.label = folder.name;
          folder.icon = 'fa-folder-o';
          folder.items = [];
          folder.command = (event: any)=> this.loadMenu(event)
          this.menuItems.push(folder);
        }
      }
    });
    this.name.setValue(this.folder.name)
  }

  open() {
    this.modal.open()
  }

  loadMenu(event: any) {
    event.originalEvent.stopPropagation();

    let htmlTarget: any = event.originalEvent.target;
    if ($(htmlTarget).hasClass('fa-caret-right') || $(htmlTarget).hasClass('fa-caret-down')) {
      console.log(event);
      if (event.item.expanded) {
        this.apiBaseService.get(`note/folders/${event.item.id}`).subscribe((res: any) => {
          event.item.items.length = 0;
          for (let folder of res.data) {
            folder.label = folder.name;
            folder.icon = 'fa-folder-o';
            folder.styleClass = `js-note-folders-tree-${folder.id}`;
            folder.items = [];
            folder.command = (event: any)=> this.loadMenu(event);
            event.item.items.push(folder);
          }
        });
      }
    } else {
      this.folder.parent_id = event.item.id;
      event.item.expanded = !event.item.expanded;

      $(htmlTarget).closest('.well-folder-tree').find('a').removeClass('active');
      $(htmlTarget).closest('a').addClass('active');
    }
  }

  setDestinationFolder(folder: any) {
    this.folder = folder;
    $('.well-folder-tree-root + .well-folder-tree .ui-panelmenu-panel a').removeClass('active');
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
