import { Component, OnInit, ViewChild, EventEmitter, Output, OnDestroy } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';

@Component({
  moduleId: module.id,
  selector: 'z-contact-share-import-contact',
  templateUrl: 'import-contact.component.html'
})

export class ZContactShareImportContactComponent implements OnInit, OnDestroy{
  @ViewChild('modal') modal: BsModalComponent;
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

  constructor() {}

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

  iCloudIntroduce() {
    this.modal.close();
    this.icloud.open();
  }
}
