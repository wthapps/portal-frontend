import { Component, OnInit, ViewChild } from '@angular/core';
import { SoPost } from '../../../shared/models/social_network/so-post.model';
import { ApiBaseServiceV2 } from '../../../shared/services/apibase.service.v2';
import { SocialService } from '../services/social.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../../partials/loading/loading.service';
import { PostEditComponent } from './post-edit.component';
import { PostService } from './index';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'so-post-list',
  templateUrl: 'post-list.component.html'
})

export class PostListComponent implements OnInit {
  @ViewChild('postEditModal') postEditModal: PostEditComponent;


  items: Array<SoPost>;
  uuid: string;
  type: string = "user";

  constructor(
    public apiBaseServiceV2: ApiBaseServiceV2,
    private socialService: SocialService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private postService: PostService
  ) {
  }

  ngOnInit() {
    // this.route.params.subscribe(params => {
    //   this.uuid = params['id'];
      this.loadPosts();
    // });
  }

  mapPost(post:any) {
    return new SoPost().from(post);
  }

  loadPosts() {
    this.loadingService.start('#post-list-component');
    this.postService.list({uuid: this.uuid, type: this.type})
    .subscribe(
      (res: any) => {
        this.loadingService.stop('#post-list-component');
        this.items = res.data;
        this.items = _.map(this.items, this.mapPost);
      }
    )
  }

  /**
   * Post actions
   */

  openEditModal(options: any) {
    this.postEditModal.open(options);
  }

  save(options: any = { mode: 'add', item: null, isShare: false}) {
    // _.assign(options.item, {tags_json: options.item.tags, photos_json: options.item.photos});
    if (options.mode == 'add') {
      this.postService.add(options.item)
        .subscribe((response: any) => {
          this.loadPosts();
          this.postEditModal.close();
        },
        error => {
          console.log('error', error);
        }
      );
    } else if(options.mode == 'edit'){
      this.postService.update(options.item)
        .subscribe((response: any) => {
            this.loadPosts();
            this.postEditModal.close();
          },
          error => {
            console.log('error', error);
          }
        );
    }
    // console.log('save item...............', item);
    //
    // let body: string;
    // let url: string = 'zone/social_network/posts';
    // body = JSON.stringify({
    //   post: {
    //     description: item.description,
    //     photos_json: this.post.photos, // TODO refactor on view formControl=photosCtrl
    //     tags_json: this.post.tags,
    //     privacy: this.post.privacy,
    //     adult: this.post.adult,
    //     disable_comment: this.post.disable_comment,
    //     disable_share: this.post.disable_share,
    //     mute: this.post.mute
    //   },
    //   parent_id: this.parent != null ? this.parent['id'] : null, // get parent post id
    //   custom_objects: this.custom_objects
    // });
    //
    // if(this.mode == 'add') {
    //   this.apiService.post(url, body)
    //       .map(res => res.json())
    //       .subscribe((result: any) => {
    //           this.onEdited.emit(result['data']);
    //           this.modal.close();
    //         },
    //         error => {
    //           console.log('error', error);
    //         }
    //       );
    //
    // } else if(this.mode == 'edit') {
    //   url += `/${this.post.uuid}`;
    //   this.apiService.put(url, body)
    //       .map(res => res.json())
    //       .subscribe((result: any) => {
    //           this.onEdited.emit(result['data']);
    //           this.modal.close();
    //         },
    //         error => {
    //           console.log('error', error);
    //         }
    //       );
    // }
  }

  dismiss(item: any) {
    console.log('dismiss item...............', item);
  }

  viewDetail() {
    console.log('list viewing details..........');
  }

  edit() {
    console.log('list editing..................');
  }

  update(att: any) {
    console.log('list updating.................');
  }

  delete() {
    console.log('list deleting.................');
  }

  updatedPost(event: any) {
    this.loadPosts();
  }

  deletedPost(event: any) {
    this.loadPosts();
  }

}

