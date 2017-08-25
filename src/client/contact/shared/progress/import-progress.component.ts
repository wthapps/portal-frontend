import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ZContactService } from '../services/contact.service';
import { Subscription } from 'rxjs/Subscription';
import { GoogleApiService } from '../services/google-api.service';
import { ModalDockComponent } from '../../../core/shared/components/modal/dock.component';
import { LoadingService } from '../../../core/shared/components/loading/loading.service';
import { ContactAddLabelModalComponent } from '../modal/contact-add-label/contact-add-label-modal.component';

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
  public importStatus: any;

  constructor(private contactService: ZContactService,
              public gapi: GoogleApiService,
              public loadingService: LoadingService) {

    this.importSubscription = this.contactService.importContactDataService.eventIn.subscribe((event: any) => {
      switch (event.action) {
        case 'contact:contact:open_import_progress:google':
          this.open();
          break;
        case 'contact:contact:close_import_progress:google':
          this.close();
          break;
        default:
          console.error('Unhandled event action type: ', event.action);
      }
    });
  }

  ngOnDestroy() {
    this.importSubscription.unsubscribe();
  }

  open(options?: any) {
    console.log('importStatus: ', this.importStatus);
    this.importedContacts.length = 0;
    // this.modalDock.open();
    this.startImportContacts();
  }

  startImportContacts(): Promise<any> {
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
          console.log('importContact data: ', data);
          if(data !== undefined) {
            this.importedContacts = data;
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

  close(options?: any) {
    this.modalDock.close();
  }

  addToLabel(event?: any) {
    console.log('AddToLabel: ', this.importedContacts);
    this.modalDock.close();

    // this.addLabel.contacts = this.importedContacts;
    this.addLabel.open({contacts: this.importedContacts});
  }

  stop(event?: any) {
    console.log('stop: ', this.importedContacts);
    this.modalDock.close();
  }

  retry(event?: any) {
    console.log('import progress - retry: ');

    this.startImportContacts();
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
