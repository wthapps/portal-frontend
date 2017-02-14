import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { SoPost } from '../../../../shared/models/social_network/so-post.model';
import { PostComponent } from '../post.component';
import {SoPost} from "../../../core/shared/models/social_network/so-post.model";
import {UserService} from "../../../core/shared/services/user.service";
// import { UserService } from '../../../../shared/services/user.service';

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
              public userService: UserService,
              private router: Router,
              private postItem: PostComponent) {
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
        this.router.navigate(['/zone/social/photos', this.item.uuid, {index: data}]);
        break;
    }
  }
}
