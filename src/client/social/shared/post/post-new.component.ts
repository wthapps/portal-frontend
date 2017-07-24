import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
// import { ApiBaseService, LoadingService } from '../../../shared/index';
import { PostEditComponent } from './index';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { LoadingService } from '../../../core/shared/components/loading/loading.service';
import { User } from '../../../core/shared/models/user.model';
import { SocialService } from '../services/social.service';
import { UserService } from '../../../core/shared/services/user.service';
import { Observable } from 'rxjs/Observable';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-new',
  templateUrl: 'post-new.component.html'
})

export class PostNewComponent implements OnInit {
  // @ViewChild('photoSelectModal') photoModal: PostPhotoSelectComponent;
  @ViewChild('postAddModal') postAddModal: PostEditComponent;
  @Output() onPostAdded: EventEmitter<any> = new EventEmitter<any>();

  selectedPhotos: Array<any> = new Array<any>();
  uploadPhotos: Array<any> = new Array<any>();
  // files: Array<any> = new Array<any>();
  // user: User;
  user$: Observable<any>;

  constructor(private apiService: ApiBaseService,
              private socialService: SocialService,
              public userService: UserService,
              private loadingService: LoadingService) {
    this.user$ =  this.userService.profile$;
  }

  ngOnInit(): void {
      // this.user = this.socialService.user.profile;
  }

  open(event: any, choosePhotos?: boolean) {
    if (choosePhotos == true) {
      // this.photoModal.open();
      return;
    }
    this.postAddModal.open();
  }

  next(photos: any) {
    // this.photoModal.close();
    this.selectedPhotos = _.reverse(photos);
    this.postAddModal.open({post: {photos: this.selectedPhotos}});
  }

  close(photos: any) {
    if (photos.length > 0) {
      // this.photoModal.open();
    }
  }

  addedPost(post: any) {
    this.onPostAdded.emit(post);
  }

  post(event: any) {
    console.log('doing posting');
  }

}
