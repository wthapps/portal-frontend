import {
  Component,
  ViewChild,
  Input,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { WthAppsBaseModal } from '@wth/shared/shared/interfaces/wthapps-base-modal';
import { BsModalComponent } from 'ng2-bs3-modal';
@Component({
  selector: 'post-likedislike',
  templateUrl: 'post-likedislike.component.html'
})
export class PostLikeDislikeComponent implements OnChanges, WthAppsBaseModal {
  @Input() type: any;
  @Input() item: any;
  @ViewChild('modal') modal: BsModalComponent;
  event: any;

  ngOnChanges(data: any) {}

  open(options?: any) {
    this.item = _.get(options, 'item');
    this.type = _.get(options, 'type');

    this.modal
      .open(options)
      .then(res => console.log('Post like dislike opened'));
  }

  close(options?: any) {}
}
