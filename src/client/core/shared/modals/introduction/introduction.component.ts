import { Component, ViewChild, Input, OnDestroy } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { UserService } from '../../services/user.service';


@Component({
  moduleId: module.id,
  selector: 'introduction-modal',
  styleUrls: ['introduction.component.css'],
  templateUrl: 'introduction.component.html'
})

export class IntroductionModalSharedComponent implements OnDestroy {
  @ViewChild('modal') modal: ModalComponent;
  @Input() data: any;
  @Input() after: any;
  index: number = 0;
  sub: any;
  sub2: any;

  constructor(private userService: UserService) {

  }

  ngOnDestroy() {
    if(this.sub) this.sub.unsubscribe();
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
    let introduction = {...this.userService.profile.introduction, ...this.after};
    this.userService.update(`users/${this.userService.profile.id}`, {introduction: introduction}).subscribe((result: any) => {

    });
  }

  done() {
    this.modal.close();
  }

  setIndex(index: any) {
    this.index = index;
  }
}
