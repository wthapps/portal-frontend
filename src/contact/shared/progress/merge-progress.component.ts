import {
  Component,
  ViewChild,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import { ZContactService } from '../services/contact.service';
import { Subscription } from 'rxjs/Subscription';
import { GoogleApiService } from '../services/google-api.service';
import { ModalDockComponent } from '../../../shared/shared/components/modal/dock.component';
import { LoadingService } from '../../../shared/shared/components/loading/loading.service';
import { CommonEventService } from '../../../shared/services/common-event/common-event.service';
import { CommonEvent } from '../../../shared/services/common-event/common-event';

@Component({
  selector: 'z-contact-share-merge-progress',
  templateUrl: 'merge-progress.component.html',
  styleUrls: ['merge-progress.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZContactShareMergeProgressComponent implements OnDestroy {
  @ViewChild('modalDock') modalDock: ModalDockComponent;

  STATUS: any = {
    processing: 1,
    done: 2,
    error: 3,
    cancelled: 4,
    undoed: 5
  };
  // mergeContacts: Array<any> = [];

  mergeSubscription: Subscription;
  status: any;
  successfulNum: Number = 0;
  failedNum: Number = 0;

  constructor(
    private contactService: ZContactService,
    public loadingService: LoadingService,
    private commonEventService: CommonEventService
  ) {
    this.mergeSubscription = this.commonEventService
      .filter(
        (event: CommonEvent) => event.channel === 'contact:contact:actions:merge'
      )
      .subscribe((event: CommonEvent) => {
        this.doEvent(event);
      });
  }

  doEvent(event: any) {
    console.log('doEvent: ', event);

    switch (event.action) {
      case 'open': {
        this.status = this.STATUS.processing;
        this.modalDock.open();

        this.contactService
          .mergeDuplicateContacts()
          .then((res: any) => {
            this.status = this.STATUS.done;
            console.log('merge duplicate is DONE');
          })
          .catch(err => (this.status = this.STATUS.error));
        break;
      }
    }
  }

  ngOnDestroy() {
    this.mergeSubscription.unsubscribe();
  }

  undo() {
    this.contactService
      .undoMerge()
      .then(res => (this.status = this.STATUS.undoed))
      .then(() =>
        setTimeout(() => {
          this.modalDock.close();
        }, 5000)
      )
      .catch(err => {
        console.warn(err);
        this.status = this.STATUS.error;
      });
  }
}
