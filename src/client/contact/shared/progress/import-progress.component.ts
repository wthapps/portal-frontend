import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ZContactService } from '../services/contact.service';
import { Subscription } from 'rxjs/Subscription';
import { GoogleApiService } from '../services/google-api.service';
import { ModalDockComponent } from '../../../core/partials/modal/dock.component';
import { LoadingService } from '../../../core/partials/loading/loading.service';

@Component({
  moduleId: module.id,
  selector: 'z-contact-share-import-progress',
  templateUrl: 'import-progress.component.html'
})

export class ZContactShareImportProgressComponent implements OnInit, OnDestroy {
  @ViewChild('modalDock') modalDock: ModalDockComponent;

  IMPORT_STATUS: any = {
    importing: 1,
    done: 2,
    error: 3,
    cancelled: 4
  }
  importedContacts: Array<any> = [];

  importSubscription: Subscription;
  public importStatus: any;

  constructor(private contactService: ZContactService,
              private gapi: GoogleApiService,
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

  ngOnInit() {

  }

  ngOnDestroy() {
    this.importSubscription.unsubscribe();
  }

  open(options?: any) {

    console.log('importStatus: ', this.importStatus);
    this.importedContacts.length = 0;
    // this.modalDock.open();
    this.gapi.isSignedIn()
      .then((user: any) => {
        this.modalDock.open();
        this.importStatus = this.IMPORT_STATUS.importing;
        return this.gapi.startImportContact(user);})
      .then((data: any) => {
        console.log('importContact data: ', data);
        // this.contactService.contactAddContactService.sendOut({data: data});
        this.importedContacts = data;
        this.contactService.addMoreContacts(data);
        this.importDone()})
      .catch((err: any) => {console.log('importContact err: ', err); this.importDone(err)});
  }

  close(options?: any) {
    this.modalDock.close();
  }

  addToLabel(event?: any) {
    console.log('AddToLabel: ', this.importedContacts);
    this.modalDock.close();
  }

  stop(event?: any) {
    console.log('stop: ',this.importedContacts);
    this.modalDock.close();
  }

  private importDone(error?: any) {
    if (!error)
      this.importStatus = this.IMPORT_STATUS.done;
    else
      this.importStatus = this.IMPORT_STATUS.error;
    // setTimeout(() => this.modalDock.close(), 2000);
  }
}
