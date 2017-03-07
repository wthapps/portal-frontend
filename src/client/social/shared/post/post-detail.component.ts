import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BaseZoneSocialItem } from '../../base/base-social-item';
import { PostEditComponent, PostService } from './index';
import { Location } from '@angular/common';
import { SoPost } from '../../../core/shared/models/social_network/so-post.model';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'so-post-detail',
  templateUrl: 'post-detail.component.html'
})

export class PostDetailComponent extends BaseZoneSocialItem implements OnInit {
  @ViewChild('postEditModal') postEditModal: PostEditComponent;

  item: SoPost = new SoPost();
  errorMessage: string;

  private id: string = '';


  constructor(public apiBaseService: ApiBaseService,
              private route: ActivatedRoute,
              public location: Location,
              private postService: PostService) {
    super();
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.id = params['id'];
      this.loadPost(this.id);
    });

  }

  loadPost(uuid: string): void {
    this.loadItem(this.apiBaseService.urls.zoneSoPosts + '/' + uuid)
      .subscribe((response: any) => {
          this.item = new SoPost().from(response.data);
        },
        (error: any) => {
          this.errorMessage = error;
        }
      );
  }


  save(options: any = {mode: 'edit', item: null, isShare: false}) {
    this.postService.update(options.item)
      .subscribe((response: any) => {
          // // Update item
          let updatedPost = new SoPost().from(response.data);
          delete updatedPost.comments;
          this.item = _.merge({}, this.item, updatedPost);

          this.postEditModal.close();
          console.log('Post after save: ', this.item);
        },
        (error: any) => {
          console.log('error', error);
        }
      );
  }

  openEditModal(options: any) {
    this.postEditModal.open(options);
  }

  dismiss(event: any) {
  //
  }

}


