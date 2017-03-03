import { Component, OnInit, ViewChild, Input, HostListener, AfterViewInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PostEditComponent } from './post-edit.component';
import { PostService } from './index';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { SocialService } from '../../shared/services/social.service';
import { LoadingService } from '../../../core/partials/loading/loading.service';
import { SoPost } from '../../../core/shared/models/social_network/so-post.model';
import { User } from '../../../core/shared/models/user.model';
import { PostPhotoSelectComponent } from './post-photo-select.component';
import { Constants } from '../../../core/shared/config/constants';
import { InfiniteScrollEvent } from 'angular2-infinite-scroll';
import { CommunitiesDataService } from '../../communities/communities-data.service';

declare var _: any;
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'so-post-list',
  templateUrl: 'post-list.component.html'
})

export class PostListComponent implements OnInit {
  @ViewChild('postEditModal') postEditModal: PostEditComponent;
  // @ViewChild('photoSelectModal') photoModal: PostPhotoSelectComponent;

  @Input() type: string = undefined;
  @Input() community: any = undefined;

  items: Array<SoPost>;
  uuid: string;
  currentUser: User;
  commentBox:any;
  page_index:number = 0;
  loading_done:boolean = false;
  readonly post_limit: number = Constants.soPostLimit;
  // type: string = 'user';

  constructor(public apiBaseService: ApiBaseService,
              public socialService: SocialService,
              private loadingService: LoadingService,
              private route: ActivatedRoute,
              private router: Router,
              private postService: PostService,
              private comDataService: CommunitiesDataService) {
  }

  ngOnInit() {
    this.currentUser = this.socialService.user.profile;
    this.route.params.subscribe(params => {
      this.uuid = params['id'];  // this can be user uuid or community uuid
      this.reloadPosts();
    });
    // this.photoModal.action = 'DONE';
    // this.photoModal.photoList.multipleSelect = false;
  }

    mapPost(post: any) {
    return new SoPost().from(post);
  }

  loadPosts() {
    this.loadingService.start('#post-list-component');
    this.postService.list({uuid: this.uuid, type: this.type, page_index: this.page_index, limit: this.post_limit})
      .subscribe(
        (res: any) => {
          this.loadingService.stop('#post-list-component');
          if(this.items == undefined)
            this.items = _.map(res.data, this.mapPost);
          else
            this.items.push(..._.map(res.data, this.mapPost));
          this.loading_done = res.loading_done;
          this.comDataService.loadingDone = this.loading_done;
          if(!this.loading_done)
            this.page_index += 1;
        },
        (error: any) => {
          console.log('loading posts errors: ', error);
        }
      );
  }

  reloadPosts() {
    this.page_index = 0;
    this.loading_done = false;
    this.comDataService.loadingDone = this.loading_done;
    this.loadPosts();
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
            this.items.unshift(..._.map([response.data], this.mapPost)); // Adding new post at the beginning of posts array
            // this.loadPosts();
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
    // this.photoModal.open();
  }

  onSelectPhotoComment(photos: any) {
    if (this.commentBox) {
      this.commentBox.commentAction(photos);
    }
    // this.photoModal.close();
  }

  viewMorePosts() {
    this.loadPosts();
  }

}

