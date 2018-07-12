import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { filter } from 'rxjs/operators/filter';
import { take } from 'rxjs/operators/take';
import { Subject } from 'rxjs/Subject';

import { PostComponent } from '../post.component';
import { PhotoService, UserService } from '@wth/shared/services';
import { Constants } from '@wth/shared/constant';
import { SoPost } from '@wth/shared/shared/models';
import { WTHEmojiPipe } from '@wth/shared/components/emoji/emoji.pipe';
import { WTHEmojiService } from '@wth/shared/components/emoji/emoji.service';

@Component({
  selector: 'so-post-body',
  templateUrl: 'post-body.component.html'
})

export class PostBodyComponent implements OnInit, OnChanges, OnDestroy {
  @Input() item: SoPost;
  @Input() type: string;
  @Input() originalPost: SoPost;
  parentItem: SoPost = new SoPost();
  originalParent: SoPost;

  showInfo: boolean = false;
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
  transformedDescription: string;
  private emojiPipe: WTHEmojiPipe;
  private destroySubject: Subject<any> = new Subject<any>();
  readonly DEFAULT_IMAGE: string = Constants.img.default;

  constructor(private router: Router,
              private wthEmojiService: WTHEmojiService,
              public photoService: PhotoService,
              public userService: UserService,
              public postItem: PostComponent) {
    this.emojiPipe = new WTHEmojiPipe(this.wthEmojiService);
  }

  ngOnInit() {
    if(this.item)
      this.transformedDescription = this.item.description;
    this.emojifyData();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.type == 'info') {
      this.showInfo = true;
    }

    if (_.get(changes['item'], 'currentValue.parent_post')) {
      let parentItem: any = changes['item'].currentValue.parent_post;
      let remainPhotos: number = parentItem.photos.length - 6;
      this.originalParent = _.cloneDeep(parentItem);

      parentItem.photos.splice(6);

      this.parentItem = Object.assign(parentItem, {remainPhotos: remainPhotos});
    }

    this.hasLike = _.findIndex(this.item.likes, ['owner.uuid', this.userService.getSyncProfile().uuid] ) > -1;
    this.hasDislike = _.findIndex(this.item.dislikes, ['owner.uuid', this.userService.getSyncProfile().uuid] ) > -1;
    this.emojifyData();
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.complete();
  }

  emojifyData() {
    this.wthEmojiService.name2baseCodeMap$.pipe(
      filter(map => Object.keys(map).length > 0),
      take(1)
      // takeUntil(this.destroySubject)
    ).subscribe(map => {
      this.transformedDescription = this.emojiPipe.transform(this.item.description);
    });
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
        let post = _.get(data, 'parentItem', this.originalPost);
        let photoIds = _.map(post.photos, 'id');
        this.router.navigate([{
          outlets: {
            modal: [
              'photos',
              data.uuid,
              { batchQuery: `/media/media?type=photo&parentable_id=${post.id}&parentable_type=SocialNetwork::Post`,
                module: 'social',
                post_uuid: post.uuid
              }
            ]
          }
        }], { queryParamsHandling: 'preserve', preserveFragment: true });
        break;
      case this.actions.onShowPostDetail:
        let parentUuid = data;
        this.router.navigate(([{outlets: {detail: ['posts', parentUuid]}}]));
        break;
    }
  }
}
