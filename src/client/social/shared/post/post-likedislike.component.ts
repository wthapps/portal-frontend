import { Component, ViewChild, Input, OnChanges } from '@angular/core';
import { HdModalComponent } from '../../../core/shared/ng2-hd/modal/components/modal';
import { WthAppsBaseModal } from '../../../core/shared/interfaces/wthapps-base-modal';
// import { HdModalComponent } from '../../shared/ng2-hd/modal/index';


declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-likedislike',
  templateUrl: 'post-likedislike.component.html'
})

export class PostLikeDislikeComponent implements OnChanges, WthAppsBaseModal {
  @Input() type: any;
  @Input() item: any;
  @ViewChild('modal') modal: HdModalComponent;
  event: any;

  ngOnChanges(data: any) {
    // console.log('this.type:', this.type);
    // console.log('this.item:', this.item);
  }

  open(options?: any) {

    this.item = _.get(options, 'item');
    this.type = _.get(options, 'type');

    this.modal.open(options)
      .then((res:any) => console.log('Post like dislike opened'));
  }

  close(options?: any) {

  }
}
