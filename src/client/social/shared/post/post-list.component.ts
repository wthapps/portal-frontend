import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostEditComponent } from './post-edit.component';
import { PostService } from './index';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { SocialService } from '../../shared/services/social.service';
import { LoadingService } from '../../../core/partials/loading/loading.service';
import { SoPost } from '../../../core/shared/models/social_network/so-post.model';
import { User } from '../../../core/shared/models/user.model';
import { PostPhotoSelectComponent } from './post-photo-select.component';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'so-post-list',
  templateUrl: 'post-list.component.html'
})

export class PostListComponent implements OnInit {
  @ViewChild('postEditModal') postEditModal: PostEditComponent;
  @ViewChild('photoSelectModal') photoModal: PostPhotoSelectComponent;

  @Input() type: string = undefined;
  @Input() community: any = undefined;

  items: Array<SoPost>;
  uuid: string;
  currentUser: User;
  commentBox:any;
  // type: string = 'user';

  constructor(public apiBaseService: ApiBaseService,
              public socialService: SocialService,
              private loadingService: LoadingService,
              private route: ActivatedRoute,
              private postService: PostService) {
  }

  ngOnInit() {
    this.currentUser = this.socialService.user.profile;
    this.route.params.subscribe(params => {
      this.uuid = params['id'];  // this can be user uuid or community uuid
      this.loadPosts();
    });
    this.photoModal.action = 'DONE';
    this.photoModal.photoList.multipleSelect = false;
  }

  mapPost(post: any) {
    return new SoPost().from(post);
  }

  loadPosts() {
    this.loadingService.start('#post-list-component');
    this.postService.list({uuid: this.uuid, type: this.type})
      .subscribe(
        (res: any) => {
          this.loadingService.stop('#post-list-component');
          this.items = _.orderBy(res.data, ['created_at'], ['desc']);
          this.items = _.map(this.items, this.mapPost);
        },
        (error: any) => {
          console.log('loading posts errors: ', error);
        }
      );
  }

  /**
   * Post actions
   */

  openEditModal(options: any) {
    this.postEditModal.open(options);
  }

  save(options: any = {mode: 'add', item: null, isShare: false}) {
    // _.assign(options.item, {tags_json: options.item.tags, photos_json: options.item.photos});
    if (options.mode == 'add') {
      this.postService.add(options.item)
        .subscribe((response: any) => {
            console.log('response', response);
            this.loadPosts();
            this.postEditModal.close();
          },
          (error: any) => {
            console.log('error', error);
          }
        );
    } else if (options.mode == 'edit') {
      this.postService.update(options.item)
        .subscribe((response: any) => {
            this.loadPosts();
            this.postEditModal.close();
          },
          (error: any) => {
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


  openPhotoModal(e:any) {
    this.commentBox = e;
    this.photoModal.open();
  }

  onSelectPhotoComment(photos: any) {
    if (this.commentBox) {
      this.commentBox.commentAction(photos);
    }
    this.photoModal.close();
  }

}

