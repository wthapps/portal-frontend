import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { ZContactService } from '../../services/contact.service';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { HConfirmationService } from '../../../../core/shared/ng2-hd/services/confirmation.service';
import { GenericFileService } from '../../../../core/shared/services/generic-file.service';
import { FileUploadHelper } from '../../../../core/shared/helpers/file/file-upload.helper';
import { GenericFile } from '../../../../core/shared/models/generic-file.model';

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
  private fileUploadHelper: FileUploadHelper;

  constructor(
    private fileService: GenericFileService,
    private confirmationService: HConfirmationService) {
      this.fileUploadHelper = new FileUploadHelper();
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
  }

  handleUpload(event: any) {
    // show importing dock


    // upload files
    // for (let i = 0; i < event.files.length; i++) {
    //   this.upload(event.files[i]);
    // }
    console.log('uploading::::', event);

    this.fileUploadHelper.upload(event.files, (event: any, file: any) => {
      let genericFile = new GenericFile({
        file: event.target['result'],
        name: file.name,
        content_type: file.type
      });
      // update current message and broadcast on server
      this.fileService.create(genericFile)
        .subscribe((response: any) => {
          console.log('send file successfully', response);
        });
    });

    // show result after importing from file
  }

  upload(file: any) {
    this.fileUploadHelper.upload(file, (event: any, file: any) => {
      let genericFile = new GenericFile({
        file: event.target['result'],
        name: file.name,
        content_type: file.type
      });
      // update current message and broadcast on server
      this.fileService.create(genericFile)
        .subscribe((response: any) => {
          console.log('send file successfully', response);
        });
    });

  }
}
