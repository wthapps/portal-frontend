import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { CommonEventService } from '@shared/services/common-event/common-event.service';
import { ApiBaseService } from '@shared/services/apibase.service';
import { Store } from '@ngrx/store';
import { withLatestFrom, filter } from 'rxjs/operators';
import { DriveFolderModule } from 'drive/folders/folders.module';
import { DriveFolderService } from 'drive/shared/services/drive-folder.service';
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
  breadcrumb = false;
  mode = 'add';

  constructor(private fb: FormBuilder,
    private folderService: DriveFolderService,
    private driveService: DriveService,
    private modalService: DriveModalService,
    private commonEventService: CommonEventService,
    private apiBaseService: ApiBaseService, private store: Store<any>) {
    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required])]
    });

    this.name = this.form.controls['name'];

    // TODO: Move this code to ModalMasterComponent
    this.modalService.modalEvent$.pipe(
      filter(event => event.action === 'drive:folder:create')
    ).subscribe(() => {
      this.modal.open();
    })
  }

  ngOnInit(): void {
    this.name.setValue(this.folder.name);
  }


  open(options?: any) {
    this.mode = options.mode;
    if (this.mode === 'add') {
      this.titleModal = 'Add Folder';
    } else if (this.mode === 'edit') {
      this.titleModal = 'Edit Folder';
      this.folder = options.folder;
      this.breadcrumb = options.breadcrumb;
    }
    this.modal.open();
  }

  onSubmit(value: any) {
    this.folder.name = value.name;
    if (this.folder.id) {
      this.folderService.update(this.folder).toPromise()
      .then(res => {
        this.driveService.updateData([res.data]);
        // TODO: Update left menu
      //   this.commonEventService.broadcast({action: 'update', channel: 'noteLeftMenu', payload: [res.data]});
        this.modal.close();

      });
    } else {
      if (this.currentFolder) {
        this.folder.parent_id = this.currentFolder.id;
      }

      this.folderService.create(this.folder).toPromise().then(res => {
        this.driveService.prependData([res.data]);
        // TODO: Update left menu
        //     this.commonEventService.broadcast({action: 'update', channel: 'noteLeftMenu', payload: [combine.res.data]});
          this.modal.close();
      });
    }
  }
}
