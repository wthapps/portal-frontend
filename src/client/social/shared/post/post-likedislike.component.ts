import { Component, ViewChild, Input, OnChanges } from '@angular/core';
import { HdModalComponent } from '../../../core/shared/ng2-hd/modal/components/modal';
import { BaseSocialModal } from './shared/modal/base-social-modal';
// import { HdModalComponent } from '../../shared/ng2-hd/modal/index';


declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-likedislike',
  templateUrl: 'post-likedislike.component.html'
})

export class PostLikeDislikeComponent implements OnChanges, BaseSocialModal {
  @Input() type: any;
  @Input() item: any;

  @ViewChild('modal') modal: HdModalComponent;

  ngOnChanges(data: any) {
    // console.log('this.type:', this.type);
    // console.log('this.item:', this.item);
  }

  open(body?: any) {

    this.item = _.get(body, 'item');
    this.type = _.get(body, 'type');

    this.modal.open(body)
      .then((res:any) => console.log('Post like dislike opened'));
  }

  close(body?: any) {

  }
}
