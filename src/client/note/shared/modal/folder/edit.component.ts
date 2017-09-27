import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';

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

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required])]
    });

    this.name = this.form.controls['name'];
  }

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'File 1',
        icon: 'fa-folder-o',
        icon: 'fa-folder-o',
        items: [
          {
            label: 'File 1-0',
            icon: 'fa-folder-o',
            items: [],
            command: (event: any)=> this.loadMenu(event)
          }
        ],
        command: (event: any)=> this.loadMenu(event)
      },
      {
        label: 'File 2',
        icon: 'fa-folder-o',
        items: [],
        command: (event: any)=> this.loadMenu(event)
      }
    ];
  }

  open() {
    this.modal.open()
  }

  loadMenu(event: any) {
    console.log(event);

    event.originalEvent.stopPropagation();
    console.log(event.originalEvent.target.className);
    if (event.originalEvent.target.className == 'ui-menuitem-text') {
      alert('choose this folder');
      event.item.expanded = false;
    } else {
      if (event.item.expanded) {
        let menuItem: any = {
          label: 'File 1-1',
          icon: 'fa-folder-o',
          items: [],
          command: (event: any)=> this.loadMenu(event)
        };
        event.item.items.push(menuItem);

      }
    }
  }


  onSubmit(value: any) {
    console.log(value);
  }
}
