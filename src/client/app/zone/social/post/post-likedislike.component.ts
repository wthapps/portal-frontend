import {
  Component, ViewChild, OnInit, Input, Output, OnChanges, SimpleChanges,
  EventEmitter
} from '@angular/core';
import { HdModalComponent } from '../../shared/ng2-hd/modal/hd-modal.module';
import { ApiBaseService, LoadingService } from '../../../shared/index';
import { SoPost } from '../../../shared/models/social_network/so-post.model';
import { PostPhotoSelectComponent } from './post-photo-select.component';
import { Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { UserService } from '../../../shared/index';


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
    console.log('this.type:', this.type);
    console.log('this.item:', this.item);
  }
}
