import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { CommonEventService } from '@shared/services/common-event/common-event.service';
import { filter } from 'rxjs/operators';
import { DriveService } from 'drive/shared/services/drive.service';
import { DriveModalService } from 'drive/shared/services/drive-modal.service';

declare var $: any;
declare var _: any;

@Component({
  selector: 'z-drive-folder-edit-modal',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.scss']
})

export class ZDriveSharedModalFolderEditComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;

  titleModal = 'New Folder';

  form: FormGroup;
  name: AbstractControl;
  folder: any = {};
  currentFolder: any = {};
  // breadcrumb = false;
  mode = 'add';

  constructor(private fb: FormBuilder,
    private driveService: DriveService,
    private commonEventService: CommonEventService,
    private modalService: DriveModalService) {
    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required])]
    });

    this.name = this.form.controls['name'];

    // TODO: Move this code to ModalMasterComponent
    this.modalService.modalEvent$.pipe(
      filter(event => event.action === 'drive:folder:edit')
    ).subscribe(({payload}) => {
      this.open(payload);
    });
  }

  ngOnInit(): void {
    // this.name.setValue(this.folder.name);
  }


  open(options?: any) {
    this.mode = options.mode;
    this.currentFolder = options.currentFolder;
    if (this.mode === 'add') {
      this.titleModal = 'Add Folder';
    } else if (this.mode === 'edit') {
      this.titleModal = 'Edit Folder';
      this.name.setValue(options.name);
      this.folder = options.folder;
    }
    this.modal.open();
  }

  async onSubmit(value: any) {
    this.folder.name = value.name;
    if (this.folder.id) {
      const folder = await this.driveService.updateFolder(this.folder);
      this.commonEventService.broadcast({action: 'update', channel: 'driveLeftMenu', payload: [folder]});
      this.form.reset();
      this.modal.close();
    } else {
      if (this.currentFolder) {
        this.folder.parent_id = this.currentFolder.id;
      }

      const folder = await this.driveService.createFolder(this.folder);
      this.commonEventService.broadcast({action: 'update', channel: 'driveLeftMenu', payload: [folder]});
      this.form.reset();
      this.modal.close();
    }
  }
}
