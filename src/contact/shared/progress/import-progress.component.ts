import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ZContactService } from '../services/contact.service';
import { Subscription } from 'rxjs/Subscription';
import { GoogleApiService } from '../services/google-api.service';
import { ModalDockComponent } from '../../../shared/shared/components/modal/dock.component';
import { LoadingService } from '../../../shared/shared/components/loading/loading.service';
import { ContactAddGroupModalComponent } from '../modal/contact-add-group/contact-add-group-modal.component';
import { CommonEventService } from '../../../shared/services/common-event/common-event.service';
import { CommonEvent } from '../../../shared/services/common-event/common-event';
import { GenericFile } from '../../../shared/shared/models/generic-file.model';
import { FileReaderUtil } from '@shared/shared/utils/file/file-reader.util';
import { FileUploadPolicy } from '@shared/policies/file-upload.policy';

@Component({
  selector: 'z-contact-share-import-progress',
  templateUrl: 'import-progress.component.html'
})

export class ZContactShareImportProgressComponent implements OnDestroy {
  @ViewChild('modalDock') modalDock: ModalDockComponent;
  @ViewChild('addGroup') addGroup: ContactAddGroupModalComponent;

  IMPORT_STATUS: any = {
    importing: 1,
    done: 2,
    error: 3,
    cancelled: 4
  };
  importedContacts: Array<any> = [];

  importSubscription: Subscription;
  importStatus: any;
  successfulNum = 0;
  failedNum = 0;

  constructor(
    private contactService: ZContactService,
    public gapi: GoogleApiService,
    public loadingService: LoadingService,
    private commonEventService: CommonEventService
  ) {
    this.importSubscription = this.commonEventService.filter(
      (event: CommonEvent) => event.channel === 'contact:contact:actions').subscribe((event: CommonEvent) => {
      this.doEvent(event);
    });
  }

  ngOnDestroy() {
    this.importSubscription.unsubscribe();
  }

  // TODO move this logic to ContactService
  import(event: any) {
    switch (event.payload.provider) {
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

  async importGoogleContacts() {
    try {
      this.importStatus = undefined;
      const user = await this.gapi.isSignedIn();
      this.modalDock.open();
      this.importStatus = this.IMPORT_STATUS.importing;
      const data = await this.gapi.startImportContact(user);
      let result;
      if (data !== undefined) {
        this.importedContacts = data;
        this.successfulNum = this.gapi.totalImporting;
        this.contactService.addMoreContacts(data);
        result = await this.importDone();
      } else {
        const err: any = new Error('import contact have no data');
        result = await this.importDone(err);
      }
      return result;
    } catch (err) {
      console.warn('importContact err: ', err);
      this.importStatus = this.IMPORT_STATUS.error;
      return this.importDone(err);
    }
  }

  importFile(payload: any) {
    FileReaderUtil.readMultiple(payload.event.files).then((events: any) => {
      const file: any = payload.event.files[0];
      const genericFile = new GenericFile({
        file: events[0].target.result,
        name: file.name,
        content_type: file.type,
        importing: true
      });
      if (!FileUploadPolicy.isAllow(genericFile)) {
        this.commonEventService.broadcast({channel: 'LockMessage', payload: [genericFile]});
        return;
      }
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
        console.warn('Unhandled event action type: ', event.action);
    }
  }
  close(options?: any) {
    this.modalDock.close();
  }

  addToGroup(event?: any) {
    this.modalDock.close();

    // this.addGroup.contacts = this.importedContacts;
    this.addGroup.open({contacts: this.importedContacts});
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
    } else {
      console.warn('importDone w/ error: ', error);
      this.importStatus = this.IMPORT_STATUS.error;
      return Promise.reject(error);
    }
  }
}
