import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { ZContactService } from '../services/contact.service';
import { Subscription } from 'rxjs/Subscription';
import { CommonEvent } from '../../../core/shared/services/common-event/common-event';
import { GoogleApiService } from '../services/google-api.service';
import { ModalDockComponent } from '../../../core/shared/components/modal/dock.component';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';
import { LoadingService } from '../../../core/shared/components/loading/loading.service';

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
    error: 3
  }

  commonSubscription: Subscription;
  public importStatus: any;

  constructor(private contactService: ZContactService,
              private commonEventService: CommonEventService,
              private gapi: GoogleApiService,
              public loadingService: LoadingService) {

    this.commonSubscription = this.commonEventService.event.subscribe((event: any) => {
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
    this.commonSubscription.unsubscribe();
  }

  open(options?: any) {
    this.importStatus = this.IMPORT_STATUS.importing;

    console.log('importStatus: ', this.importStatus);
    // this.modalDock.open();
    this.gapi.isSignedIn()
      .then((user: any) => {
        this.modalDock.open();
        return this.gapi.startImportContact(user);})
      .then((data: any) => {
        console.log('importContact data: ', data);
        // this.contactService.contactAddContactService.sendOut({data: data});
        this.contactService.addMoreContacts(data)
        this.importDone()})
      .catch((err: any) => {console.log('importContact err: ', err); this.importDone(err)});
  }

  close(options?: any) {
    this.modalDock.close();
  }

  private importDone(error?: any) {
    if (!error)
      this.importStatus = this.IMPORT_STATUS.done;
    else
      this.importStatus = this.IMPORT_STATUS.error;
    setTimeout(() => this.modalDock.close(), 2000);
  }
}
