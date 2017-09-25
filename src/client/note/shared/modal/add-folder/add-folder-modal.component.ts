import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WthAppsBaseModal } from '../../../../core/shared/interfaces/wthapps-base-modal';
import { CommonEventService } from '../../../../core/shared/services/common-event/common-event.service';
import { ApiBaseService } from '../../../../core/shared/services/apibase.service';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'add-folder-modal',
  templateUrl: 'add-folder-modal.component.html',
  styleUrls: ['add-folder-modal.component.css']
})

export class ZNoteAddFolderModalComponent implements OnInit, WthAppsBaseModal {
  @ViewChild('modal') modal: ModalComponent;
  event: any;
  form: any;
  folder: any = {};

  constructor(private fb: FormBuilder, private commonEventService: CommonEventService, private apiBaseService: ApiBaseService)  {

  }

  ngOnInit() {
    this.form = this.fb.group({
      'folders': [],
    });
  }

  open() {
    this.modal.open();
  }

  close() {
    //
  }

  submit() {
    if (this.folder.id) {
      this.apiBaseService.put('note/folders/' + this.folder.id, this.folder).subscribe((res: any) => {
        this.commonEventService.broadcast({channel: 'noteCommonEvent', action: 'updateFolders', payload: res.data})
        this.modal.close();
      });
    } else {
      this.apiBaseService.post('note/folders', {name: this.folder.name}).subscribe((res: any) => {
        this.commonEventService.broadcast({channel: 'noteCommonEvent', action: 'updateFolders', payload: res.data})
        this.modal.close();
      });
    }
  }

}
