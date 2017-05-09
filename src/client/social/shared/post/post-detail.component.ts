import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
              public router: Router,
              public location: Location,
              private postService: PostService) {
    super();
  }

  ngOnInit() {
    console.log('post details........');
    this.route.params.forEach((params: Params) => {
      console.log('post details........', params);

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
    switch(options.mode) {
      case 'add':
        this.postService.add(options.item)
          .subscribe((response: any) => {
              console.log('response', response);
              // Navigate to the new shared post
              this.router.navigate(['/posts', response.data.uuid]);
              this.postEditModal.close();
            },
            (error: any) => {
              console.log('error', error);
            }
          );
        break;
      case 'edit':
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
        break;
      default:
        console.error('Unhandle save options in post detail: ', options.mode);
    }

  }

  openEditModal(options: any) {
    this.postEditModal.open(options);
  }

  dismiss(event: any) {
  //
  }

}


