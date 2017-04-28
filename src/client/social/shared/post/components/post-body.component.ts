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

export class PostBodyComponent implements OnInit, OnChanges {
  @Input() item: SoPost;
  @Input() type: string;
  parentItem: SoPost = new SoPost();

  showInfo: boolean = false;
  actions = {
    openShare: 3,
    openActivities: 4,
    onShowPhotoDetail: 5,
    openLikeDislike: 6
  };

  constructor(private route: ActivatedRoute,
              private router: Router,
              public userService: UserService,
              public postItem: PostComponent) {
  }

  ngOnInit() {
    // this.item = new SoPost(null);
    // console.log('ngOnInit:', this);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.type == 'info') {
      this.showInfo = true;
    }

    if (changes['item'].currentValue.parent) {
      this.parentItem = changes['item'].currentValue.parent;
    }
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
      case this.actions.onShowPhotoDetail:
        console.log('photo data:', data);
        let photoIds = _.map(this.item.photos, 'uuid');
        this.router.navigate(['/posts',  this.item.uuid, 'photos', data.uuid, {index: data, pIds: photoIds}]);
        break;
    }
  }
}
