import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ZContactService } from '../services/contact.service';
import { Subscription } from 'rxjs/Subscription';
import { GoogleApiService } from '../services/google-api.service';
import { ModalDockComponent } from '../../../core/shared/components/modal/dock.component';
import { LoadingService } from '../../../core/shared/components/loading/loading.service';
import { ContactAddLabelModalComponent } from '../modal/contact-add-label/contact-add-label-modal.component';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';
import { CommonEvent } from '../../../core/shared/services/common-event/common-event';
import { Constants } from '../../../core/shared/config/constants';
import { GenericFile } from '../../../core/shared/models/generic-file.model';
import { FileUploadHelper } from '../../../core/shared/helpers/file/file-upload.helper';

@Component({
  moduleId: module.id,
  selector: 'z-contact-share-import-progress',
  templateUrl: 'import-progress.component.html'
})

export class ZContactShareImportProgressComponent implements OnDestroy {
  @ViewChild('modalDock') modalDock: ModalDockComponent;
  @ViewChild('addLabel') addLabel: ContactAddLabelModalComponent;

  IMPORT_STATUS: any = {
    importing: 1,
    done: 2,
    error: 3,
    cancelled: 4
  };
  importedContacts: Array<any> = [];

  importSubscription: Subscription;
  importStatus: any;
  successfulNum: number = 0;
  failedNum: number = 0;

  private fileUploadHelper: FileUploadHelper;

  constructor(
    private contactService: ZContactService,
    public gapi: GoogleApiService,
    public loadingService: LoadingService,
    private commonEventService: CommonEventService
  ) {

    this.fileUploadHelper = new FileUploadHelper();

    this.importSubscription = this.commonEventService.filter(
      (event: CommonEvent) => event.channel == 'contact:contact:actions').subscribe((event: CommonEvent) => {
      this.doEvent(event);
    });
  }

  ngOnDestroy() {
    this.importSubscription.unsubscribe();
  }

  // TODO move this logic to ContactService
  import(event: any) {
    switch(event.payload.provider) {
      case 'google':
        this.importGoogleContacts();
        break;
      case 'apple':
        break;
      case 'microsoft':
        break;
      case 'import_from_file':
        this.importFile(event.payload);
        break;
    }
  }

  importGoogleContacts(): Promise<any> {
    this.importStatus = undefined;
    return this.gapi.isSignedIn()
      .then((user: any) => {
          this.modalDock.open();
          this.importStatus = this.IMPORT_STATUS.importing;
          return this.gapi.startImportContact(user);}
        ,(err: any) => {
          this.importStatus = this.IMPORT_STATUS.error;
          return this.importDone(err);
        })
      .then((data: any) => {
        if(data !== undefined) {
          this.importedContacts = data;
          this.successfulNum = this.gapi.totalImporting;
          this.contactService.addMoreContacts(data);
          return this.importDone();
        } else {
          let err: any = new Error('import contact have no data');
          return this.importDone(err);
        }
      },(err: any) => {
        console.log('importContact err: ', err);
        return this.importDone(err);
      });
  }

  importFile(payload: any) {
    this.fileUploadHelper.upload(payload.event.files, (event: any, file: any) => {
      let genericFile = new GenericFile({
        file: event.target['result'],
        name: file.name,
        content_type: file.type,
        importing: true
      });

      this.modalDock.open();
      this.importStatus = this.IMPORT_STATUS.importing;
      // update current message and broadcast on server
      this.contactService.import({
        import_info: { provider: payload.provider,  type: payload.type, name: payload.name, file: genericFile}
      }).subscribe((response: any) => {
          this.successfulNum = response.data.length;
          this.contactService.addMoreContacts(response.data);
          this.importDone();
        },
        (error: any) => {
          this.importStatus = this.IMPORT_STATUS.error;
          this.importDone(error);
        });
    });
  }

  open(options?: any) {
    this.importedContacts.length = 0;
    // this.startImportContacts();
  }

  doEvent(event: any) {

    switch (event.action) {
      case 'contact:contact:import_contact':
        this.import(event);
        break;
      case 'contact:contact:import_contact_close_progress':
        this.close();
        break;
      default:
        console.error('Unhandled event action type: ', event.action);
    }
  }
  close(options?: any) {
    this.modalDock.close();
  }

  addToLabel(event?: any) {
    this.modalDock.close();

    // this.addLabel.contacts = this.importedContacts;
    this.addLabel.open({contacts: this.importedContacts});
  }

  stop(event?: any) {
    console.log('stop: ', this.importedContacts);
    this.modalDock.close();
  }

  retry(event?: any) {
    this.importGoogleContacts();
  }

  private importDone(error?: any): Promise<any> {
    if (!error) {
      this.importStatus = this.IMPORT_STATUS.done;
      return Promise.resolve(this.importStatus);
    }
    else {
      console.error('importDone w/ error: ', error);
      this.importStatus = this.IMPORT_STATUS.error;
      return Promise.reject(error);
    }
  }
}
