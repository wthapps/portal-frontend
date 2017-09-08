import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { ZContactService } from '../../services/contact.service';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { HConfirmationService } from '../../../../core/shared/ng2-hd/services/confirmation.service';

@Component({
  moduleId: module.id,
  selector: 'z-contact-share-import-contact',
  templateUrl: 'import-contact.component.html'
})

export class ZContactShareImportContactComponent {
  @ViewChild('modal') modal: ModalComponent;
  @Output() optionSelected: EventEmitter<any> = new EventEmitter<any>();

  readonly OAUTH_LIST: any = [
    {name: 'google', text: 'Google Contacts', class: 'fa fa-google'},
    {name: 'apple', text: 'iCloud Contacts', class: 'fa fa-apple'},
    {name: 'outlook', text: 'Outlook Contacts', class: 'fa fa-windows'}
  ];


  formData: FormData;
  files: Array<any>;
  uploadInput: EventEmitter<any>;
  humanizeBytes: Function;
  dragOver: boolean;

  constructor(private confirmationService: HConfirmationService) {
  }

  // Format: { name }
  onOptionSelected(options: any) {
    this.optionSelected.emit(options);
    // this.modal.close();
  }

  changeFiles(event: any) {
    let files = event.target.files;
    if (files.length == 0) {
      return;
    }
    console.log('do some thing here');
  }

  select(event: any) {
    console.log('select event::::', event);
    this.confirmationService.confirm({
      message: 'testing customize label accepted?',
      header: 'My Hosts',
      acceptLabel: 'My customer accept',
      accept: () => {
        console.log('accepted::::');
      }
    });
  }

  progress(event: any) {
    console.log('progress event::::', event);
  }

  uploadOutput(output: any): void {

    console.log('inside upload Output event::::', output);

    // if (output.type === 'allAddedToQueue') {
    //   const event: any = {
    //     type: 'uploadAll',
    //     url: 'http://ngx-uploader.com/upload',
    //     method: 'POST',
    //     data: { foo: 'bar' },
    //     concurrency: this.formData.concurrency
    //   };
    //
    //   this.uploadInput.emit(event);
    // } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') {
    //   this.files.push(output.file);
    // } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
    //   const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
    //   this.files[index] = output.file;
    // } else if (output.type === 'removed') {
    //   this.files = this.files.filter((file: UploadFile) => file !== output.file);
    // } else if (output.type === 'dragOver') {
    //   this.dragOver = true;
    // } else if (output.type === 'dragOut') {
    //   this.dragOver = false;
    // } else if (output.type === 'drop') {
    //   this.dragOver = false;
    // }
  }
}
