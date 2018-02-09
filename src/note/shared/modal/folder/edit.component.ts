import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { CommonEventService } from '@shared/services/common-event/common-event.service';
import { ApiBaseService } from '@shared/services/apibase.service';
import { Store } from '@ngrx/store';
import * as note from '../../actions/note';
import * as folder from '../../actions/folder';

declare var $: any;
declare var _: any;

@Component({
  selector: 'z-note-shared-modal-folder-edit',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.scss']
})

export class ZNoteSharedModalFolderEditComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;

  titleModal: string = 'New Folder';

  form: FormGroup;
  name: AbstractControl;
  folder: any = {};
  currentFolder: any = {};
  breadcrumb: boolean = false;
  mode: string = 'add';

  constructor(private fb: FormBuilder, private commonEventService: CommonEventService, private apiBaseService: ApiBaseService, private store: Store<any>) {
    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required])]
    });

    this.name = this.form.controls['name'];
  }

  ngOnInit(): void {
    this.name.setValue(this.folder.name)
  }


  open(options?: any) {
    this.mode = options.mode;
    if (this.mode == 'add') {
      this.titleModal = 'Add Folder';
    } else if (this.mode == 'edit') {
      this.titleModal = 'Edit Folder';
      this.folder = options.folder;
      this.breadcrumb = options.breadcrumb;
    }
    this.modal.open();
  }

  onSubmit(value: any) {
    this.folder.name = value.name;
    if (this.folder.id) {
      this.apiBaseService.put('note/folders/' + this.folder.id, this.folder).subscribe((res: any) => {
        [new note.NoteUpdated(res.data), new folder.UpdateFolderPath(res.data)].forEach((a: any) => this.store.dispatch(a));
        this.commonEventService.broadcast({action: 'update', channel: 'noteLeftMenu', payload: [res.data]});
        this.modal.close();
      });
    } else {
      if (this.currentFolder) {
        this.folder.parent_id = this.currentFolder.id;
      }
      this.apiBaseService.post('note/folders', this.folder)
        .withLatestFrom(this.store, (res: any, state: any) => {
          return {res: res, state: state.context}
        })
        .subscribe((combine: any) => {
          if(combine.state.permissions.edit) {
            this.store.dispatch(new note.MultiNotesAdded([combine.res.data]));
          }
          this.commonEventService.broadcast({action: 'update', channel: 'noteLeftMenu', payload: [combine.res.data]});
          this.modal.close();
        });
    }
  }
}
