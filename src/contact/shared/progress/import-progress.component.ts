import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ZContactService } from '../services/contact.service';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GoogleApiService } from '../services/google-api.service';
import { ModalDockComponent } from '../../../shared/shared/components/modal/dock.component';
import { LoadingService } from '../../../shared/shared/components/loading/loading.service';
import { ContactAddGroupModalComponent } from '../modal/contact-add-group/contact-add-group-modal.component';
import { CommonEventService } from '../../../shared/services/common-event/common-event.service';
import { CommonEvent } from '../../../shared/services/common-event/common-event';
import { GenericFile } from '../../../shared/shared/models/generic-file.model';
import { FileReaderUtil } from '@shared/shared/utils/file/file-reader.util';
import { FileUploadPolicy } from '@shared/policies/file-upload.policy';
import { WUploader } from '@shared/services/w-uploader';

@Component({
  selector: 'z-contact-share-import-progress',
  templateUrl: 'import-progress.component.html',
  styleUrls: ['import-progress.component.scss']
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
  importInfo: any;
  destroy$ = new Subject();


  constructor(
    private contactService: ZContactService,
    public gapi: GoogleApiService,
    public loadingService: LoadingService,
    private commonEventService: CommonEventService,
    private uploader: WUploader
  ) {
    this.importSubscription = this.commonEventService.filter(
      (event: CommonEvent) => event.channel === 'contact:contact:actions').subscribe((event: CommonEvent) => {
      this.doEvent(event);
    });

    this.uploader.event$.pipe(takeUntil(this.destroy$)).subscribe((event: any) => {
      this.importFile(event);
    });
  }

  ngOnDestroy() {
    this.importSubscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
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
        this.uploader.open('FileInput', '.w-uploader-file-input-container', {
          allowedFileTypes: [
            'text/x-vcard',
            'application/vcard',
            'text/anytext',
            'text/directory',
            'application/x-versit',
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          ],
          maxNumberOfFiles: 1
        });
        this.importInfo = event.payload;
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

  importFile(event: any) {
    switch (event.action) {
      case 'start':
        this.modalDock.open();
        this.importStatus = this.IMPORT_STATUS.importing;
        break;
      case 'error':
        console.log('import error:::', event);
        break;
      case 'success':
        const file = event.payload.resp;
        this.contactService.import({
          import_info: {
            provider: this.importInfo.provider,
            type: this.importInfo.type,
            name: this.importInfo.name
          },
          file: file
        }).subscribe((response: any) => {
            this.successfulNum = response.data.length;
            this.contactService.addMoreContacts(response.data);
            this.importDone();
          },
          (error: any) => {
            this.importStatus = this.IMPORT_STATUS.error;
            this.importDone(error);
          });
        break;

    }
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
