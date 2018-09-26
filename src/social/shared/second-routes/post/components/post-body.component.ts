import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs/Subject';

import { PostComponent } from '../post.component';
import { PhotoService, UserService } from '@wth/shared/services';
import { Constants, MODEL_TYPE } from '@wth/shared/constant';
import { SoPost } from '@wth/shared/shared/models';
import { WTHEmojiService } from '@wth/shared/components/emoji/emoji.service';
import { WTHEmojiCateCode } from '@wth/shared/components/emoji/emoji';

@Component({
  selector: 'so-post-body',
  templateUrl: 'post-body.component.html',
  styleUrls: ['./post-body.component.scss']
})

export class PostBodyComponent implements OnInit, OnChanges, OnDestroy {
  @Input() item: SoPost;
  @Input() type: string;
  @Input() originalPost: SoPost;
  @Input() emojiMap: { [name: string]: WTHEmojiCateCode };
  parentItem: SoPost = new SoPost();
  originalParent: SoPost;

  showInfo = false;
  actions = {
    openShare: 3,
    openActivities: 4,
    onShowPhotoDetail: 5,
    openLikeDislike: 6,
    toggleComments: 7,
    onShowPostDetail: 8
  };
  hasLike: boolean;
  hasDislike: boolean;
  private destroySubject: Subject<any> = new Subject<any>();
  readonly DEFAULT_IMAGE: string = Constants.img.default;
  readonly MODEL = MODEL_TYPE;

  constructor(private router: Router,
              private wthEmojiService: WTHEmojiService,
              public photoService: PhotoService,
              public userService: UserService,
              public postItem: PostComponent) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (_.get(changes['item'], 'currentValue.parent_post')) {
      const parentItem: any = changes['item'].currentValue.parent_post;
      const remainPhotos: number = parentItem.photos.length - 6;
      this.originalParent = _.cloneDeep(parentItem);

      parentItem.photos.splice(6);

      this.parentItem = Object.assign(parentItem, {remainPhotos: remainPhotos});
    }

    this.hasLike = _.findIndex(this.item.likes, ['owner.uuid', this.userService.getSyncProfile().uuid] ) > -1;
    this.hasDislike = _.findIndex(this.item.dislikes, ['owner.uuid', this.userService.getSyncProfile().uuid] ) > -1;
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.complete();
  }

  onActions(action: any, data?: any, type?: any) {
    switch (action) {
      case this.actions.openShare:
        this.postItem.openShare();
        break;
      case this.actions.openActivities:
        this.postItem.openActivities();
        break;
      case this.actions.openLikeDislike:
        this.postItem.openLikeDislike(data, type);
        break;
      case this.actions.toggleComments:
        this.postItem.toggleComments();
        break;
      case this.actions.onShowPhotoDetail:
        const post = _.get(data, 'parentItem', this.originalPost);
        const photoIds = _.map(post.photos, 'id');
        this.router.navigate([{
          outlets: {
            modal: [
              'preview',
              data.uuid,
              {
                object: 'post',
                parent_uuid: post.uuid,
                only_preview: true
              }
            ]
          }
        }], { queryParamsHandling: 'preserve', preserveFragment: true });
        break;
      case this.actions.onShowPostDetail:
        const parentUuid = data;
        this.router.navigate(([{outlets: {detail: ['posts', parentUuid]}}]));
        break;
    }
  }
}
