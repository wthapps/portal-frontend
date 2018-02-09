import { Component, ViewChild, Input, OnDestroy } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';
import { UserService } from '@wth/shared/services';


@Component({
  selector: 'introduction-modal',
  styleUrls: ['introduction.component.css'],
  templateUrl: 'introduction.component.html'
})

export class IntroductionModalComponent implements OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;
  @Input() data: any;
  @Input() after: any;
  index: number = 0;
  sub: any;
  sub2: any;

  constructor(private userService: UserService) {

  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  open() {
    if(this.modal) {
      this.modal.open();
      this.sub = this.modal.onDismiss.subscribe(() => {
        this.update();
      })
      this.sub2 = this.modal.onClose.subscribe(() => {
        this.update();
      })
    }
  }

  update() {
    if(!this.userService.getSyncProfile())
      return;
    let introduction: any = {...this.userService.getSyncProfile().introduction, ...this.after};
    this.userService.update({introduction: introduction}).subscribe((result: any) => {

    });
  }

  done() {
    this.modal.close();
  }

  setIndex(index: any) {
    this.index = index;
  }
}
