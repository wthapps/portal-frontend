import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';

import { BaseZoneSocialItem } from '../../../shared/base/base-social-item';
import { ApiBaseService, AuthService } from '@wth/shared/services';
import { SoPost } from '@wth/shared/shared/models';
import { PostEditComponent } from './post-edit.component';
import { PostService } from './shared/post.service';
import { WTHEmojiCateCode } from '@shared/components/emoji/emoji';
import { WTHEmojiService } from '@shared/components/emoji/emoji.service';



@Component({
  selector: 'so-post-detail',
  templateUrl: 'post-detail.component.html',
  styleUrls: ['post-detail.component.scss']
})

export class PostDetailComponent extends BaseZoneSocialItem implements OnInit {
  @ViewChild('postEditModal') postEditModal: PostEditComponent;

  item: SoPost = new SoPost();
  errorMessage: string;

  private id = '';
  emojiMap$: Observable<{ [name: string]: WTHEmojiCateCode }>;


  constructor(public apiBaseService: ApiBaseService,
    private route: ActivatedRoute,
    public router: Router,
    public location: Location,
    public authService: AuthService,
    private wthEmojiService: WTHEmojiService,
    private postService: PostService) {
    super();
    this.emojiMap$ = this.wthEmojiService.name2baseCodeMap$;
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
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
    this.router.navigate([{ outlets: { detail: null } }], { queryParamsHandling: 'preserve' }).then(() => {

    });
  }


  save(options: any = { mode: 'edit', item: null, isShare: false }) {
    switch (options.mode) {
      case 'add':
        this.postService.add(options.item)
          .toPromise().then((response: any) => {
            console.log('response', response);
            // Navigate to the new shared post
            this.router.navigate([{ outlets: { detail: ['/posts', response.data.uuid] } }]
              , { queryParamsHandling: 'preserve', preserveFragment: true });
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
            const updatedPost = new SoPost().from(response.data);
            delete updatedPost.comments;
            this.item = _.merge({}, this.item, updatedPost);

            this.postEditModal.close();
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
