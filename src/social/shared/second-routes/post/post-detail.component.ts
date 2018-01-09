import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';



import { BaseZoneSocialItem } from '../../../shared/base/base-social-item';
import { ApiBaseService } from '@wth/shared/services';
import { SoPost } from '@wth/shared/shared/models';
import { PostEditComponent } from './post-edit.component';
import { PostService } from './shared/post.service';



@Component({

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
      .toPromise().then((response: any) => {
          this.item = new SoPost().from(response.data);
        },
        (error: any) => {
          this.errorMessage = error;
        }
      );
  }

  goBack() {
    this.router.navigate([{outlets: {detail: null}}], {queryParamsHandling: 'preserve' }).then(() => {

    });
  }


  save(options: any = {mode: 'edit', item: null, isShare: false}) {
    switch(options.mode) {
      case 'add':
        this.postService.add(options.item)
          .toPromise().then((response: any) => {
              console.log('response', response);
              // Navigate to the new shared post
              this.router.navigate([{outlets: {detail: ['/posts', response.data.uuid]}}], {queryParamsHandling: 'preserve', preserveFragment: true});
              this.postEditModal.close();
            },
            (error: any) => {
              console.log('error', error);
            }
          );
        break;
      case 'edit':
        this.postService.update(options.item)
          .toPromise().then((response: any) => {
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
