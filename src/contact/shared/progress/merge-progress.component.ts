import {
  Component,
  ViewChild,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import { ZContactService } from '../services/contact.service';
import { Subscription } from 'rxjs/Subscription';
import { ModalDockComponent } from '../../../shared/shared/components/modal/dock.component';
import { LoadingService } from '../../../shared/shared/components/loading/loading.service';
import { CommonEventService } from '../../../shared/services/common-event/common-event.service';
import { CommonEvent } from '../../../shared/services/common-event/common-event';

const IDLE_TIME_MS = 10000;
@Component({
  selector: 'z-contact-share-merge-progress',
  templateUrl: 'merge-progress.component.html',
  styleUrls: ['merge-progress.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZContactShareMergeProgressComponent implements OnDestroy {
  @ViewChild('modalDock') modalDock: ModalDockComponent;

  readonly STATUS: any = {
    processing: 1,
    done: 2,
    error: 3,
    cancelled: 4,
    undid: 5
  };
  // mergeContacts: Array<any> = [];

  mergeSubscription: Subscription;
  status: any;
  successfulNum: Number = 0;
  failedNum: Number = 0;
  timeoutRef: any;

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
    switch (event.action) {
      case 'open': {
        this.status = this.STATUS.processing;
        this.open();

        this.contactService
          .mergeContacts()
          .then((res: any) => {
            this.status = this.STATUS.done;
            this.autoClose();
          })
          .catch(err => (this.status = this.STATUS.error));
        break;
      }
      default:
        console.warn(`Unhandled event: ${event.action}`);
        break;
    }
  }

  ngOnDestroy() {
    this.mergeSubscription.unsubscribe();
  }

  open() {
    this.modalDock.open();
  }

  clearTimeout() {
    if (this.timeoutRef)
      clearTimeout(this.timeoutRef);
  }

  autoClose() {
    this.clearTimeout();
    this.timeoutRef = setTimeout(() => this.modalDock.close(), IDLE_TIME_MS);
  }

  undo() {
    this.clearTimeout();
    this.contactService
      .undoMerge()
      .then(res => {
        this.status = this.STATUS.undid;
        this.autoClose();
      })
      .catch(err => {
        console.warn(err);
        this.status = this.STATUS.error;
      });
  }
}
