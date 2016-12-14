import { Component, ViewChild, Input, OnChanges } from '@angular/core';
import { HdModalComponent } from '../../shared/ng2-hd/modal/hd-modal.module';


declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-likedislike',
  templateUrl: 'post-likedislike.component.html'
})

export class PostLikeDislikeComponent implements OnChanges {
  @Input() type: any;
  @Input() item: any;

  @ViewChild('modal') modal: HdModalComponent;

  ngOnChanges() {
    // console.log('this.type:', this.type);
    // console.log('this.item:', this.item);
  }
}
