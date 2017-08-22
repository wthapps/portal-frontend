import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PostComponent } from '../post.component';
import { SoPost } from '../../../../core/shared/models/social_network/so-post.model';
import { UserService } from '../../../../core/shared/services/user.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'so-post-body',
  templateUrl: 'post-body.component.html'
})

export class PostBodyComponent implements OnChanges {
  @Input() item: SoPost;
  @Input() type: string;
  @Input() originalPost: SoPost;
  parentItem: SoPost = new SoPost();

  showInfo: boolean = false;
  actions = {
    openShare: 3,
    openActivities: 4,
    onShowPhotoDetail: 5,
    openLikeDislike: 6,
    toggleComments: 7
  };
  hasLike: boolean;
  hasDislike: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public userService: UserService,
              public postItem: PostComponent) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.type == 'info') {
      this.showInfo = true;
    }

    if (changes['item'].currentValue.parent_post) {
      this.parentItem = changes['item'].currentValue.parent_post;
    }

    this.hasLike = _.findIndex(this.item.likes, ['owner.uuid', this.userService.getProfileUuid()] ) > -1;
    this.hasDislike = _.findIndex(this.item.dislikes, ['owner.uuid', this.userService.getProfileUuid()] ) > -1;
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
        let photoIds = _.map(this.originalPost.photos, 'id');
        console.log('this. item', this.originalPost.photos, data);
        // this.router.navigate([{outlets: {modal: ['photos', data.id, {module: 'social', ids: photoIds, prevUrl: this.router.url}]}}]);
        this.router.navigate([{outlets: {modal: ['photos', data.id, {module: 'social', ids: photoIds}]}}], { preserveQueryParams: true, preserveFragment: true });

        break;
    }
  }
}
