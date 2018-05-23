import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';



import { BaseZoneSocialItem } from '../../../shared/base/base-social-item';
import { SoPost } from '@wth/shared/shared/models';
import { ApiBaseService } from '@wth/shared/services';
import { Constants } from '@wth/shared/constant';






@Component({

  selector: 'so-post-detail-photo',
  templateUrl: 'post-detail-photo.component.html'
})

export class PostDetailPhotoComponent extends BaseZoneSocialItem implements OnInit, OnDestroy, AfterViewInit {
  item: SoPost;
  errorMessage: string;

  itemDisplay: any;

  index: number = 0;

  commentIndex: number;
  replyIndex: number;

  tooltip: any = Constants.tooltip;

  private id: string = '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              apiBaseService: ApiBaseService) {
    super();
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.id = params['id'];
      this.index = +params['index'];
      this.loadPost(this.id);
      this.commentIndex = params['commentIndex'];
      this.replyIndex = params['replyIndex'];
    });
  }

  ngAfterViewInit() {
    $('body').addClass('fixed-hidden').css('padding-right', Constants.windows.scrollBarWidth);
  }

  ngOnDestroy() {
    $('body').removeClass('fixed-hidden').css('padding-right', 0);
    $('#social-photo-detail').removeClass('active-info');
  }

  loadPost(uuid: string): void {
    this.loadItem(this.apiBaseService.urls.zoneSoPosts + '/' + uuid)
      .toPromise().then((response: any) => {
          this.item = response.data;
          this.itemDisplay = _.cloneDeep(this.item);
          this.classifyReactions();
          console.log(this.item);
        },
        error => {
          this.errorMessage = <any>error;
        }
      );
  }

  imgPrev() {
    if (this.index == 0) {
      this.index = this.item.photos.length - 1;
    } else {
      this.index = this.index - 1;
    }
    console.log('this.index:', this.index, '\nthis.item.photos.length:', this.item.photos.length);
  }

  imgNext() {
    if (this.index == this.item.photos.length - 1) {
      this.index = 0;
    } else {
      this.index = this.index + 1;
    }
    console.log('this.index:', this.index, '\nthis.item.photos.length:', this.item.photos.length);
  }

  onShowInfo() {
    $('#social-photo-detail').toggleClass('active-info');
  }

  onBack() {
    this.router.navigate(['/home']);
  }

  update(e: any) {

  }

  delete(e: any) {

  }


  classifyReactions() {
    this.itemDisplay.reactions_dislike = new Array<any>();
    this.itemDisplay.reactions_like = new Array<any>();
    this.itemDisplay.reactions_share = new Array<any>();
    this.itemDisplay.reactions.forEach((reaction: any) => {
      switch (reaction.reaction_type) {
        case 'dislike':
          this.itemDisplay.reactions_dislike.push(reaction);
          break;
        case 'like':
          this.itemDisplay.reactions_like.push(reaction);
          break;
        case 'share':
          this.itemDisplay.reactions_share.push(reaction);
          break;
      }
    });

  }

}