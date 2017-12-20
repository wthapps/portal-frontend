import { Component, OnInit, ViewChild, EventEmitter, Output, ViewContainerRef, OnDestroy } from '@angular/core';
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

export class ZContactShareImportContactComponent implements OnInit, OnDestroy{
  @ViewChild('modal') modal: ModalComponent;
  @ViewChild('icloud') icloud: any;
  @Output() optionSelected: EventEmitter<any> = new EventEmitter<any>();

  readonly PROVIDERS: any = [
    {name: 'google', provider: 'google', type: 'google_contacts', text: 'Google Contacts', class: 'fa fa-google'},
    {name: 'apple', provider: 'apple', type: 'apple_contacts', text: 'iCloud Contacts', class: 'fa fa-apple'},
    {name: 'outlook', provider: 'microsoft', type: 'outlook_contacts', text: 'Outlook Contacts', class: 'fa fa-windows'}
  ];


  formData: FormData;
  files: Array<any>;
  uploadInput: EventEmitter<any>;
  humanizeBytes: Function;
  dragOver: boolean;
  sub: any;
  private fileUploadHelper: FileUploadHelper;

  constructor(private fileService: GenericFileService) {
      this.fileUploadHelper = new FileUploadHelper();
  }

  ngOnInit() {
    this.sub = this.icloud.event.subscribe(() => {
      this.modal.open();
    })
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  // Format: { name }
  selectProvider(options: any) {
    this.optionSelected.emit(options);
    if(options.provider == 'import_file' || options.provider == 'apple') return;
    this.modal.close().then();
  }


  handleUpload(event: any) {
    // show importing dock

    // upload files
    // for (let i = 0; i < event.files.length; i++) {
    //   this.upload(event.files[i]);
    // }

    this.fileUploadHelper.upload(event.files, (event: any, file: any) => {
      let genericFile = new GenericFile({
        file: event.target['result'],
        name: file.name,
        content_type: file.type,
        importing: true
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
        content_type: file.type,
        importing: true
      });
      // update current message and broadcast on server
      this.fileService.create(genericFile)
        .subscribe((response: any) => {
          console.log('send file successfully', response);
        });
    });
  }

  iCloudIntroduce() {
    this.modal.close();
    this.icloud.open();
  }
}
