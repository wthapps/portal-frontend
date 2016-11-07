import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BaseZoneSocialItem } from '../base/base-social-item';
import { SoPost } from '../../../shared/models/social_network/so-post.model';
import { ApiBaseServiceV2 } from '../../../shared/services/apibase.service.v2';
import { Constants } from '../../../shared/config/constants';


declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'zone-social-photo-detail',
  templateUrl: 'photo-detail.component.html'
})

export class ZSocialPhotoDetailComponent extends BaseZoneSocialItem implements OnInit, OnDestroy, AfterViewInit {
  item: SoPost;
  errorMessage: string;

  itemDisplay: any;

  index: number = 0;
  private id: string = '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apiBaseServiceV2: ApiBaseServiceV2) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.id = params['id'];
      this.index = +params['index'];
      this.loadPost(this.id);
    });
  }

  ngAfterViewInit() {
    $('body').addClass('fixed-hidden').css('padding-right', Constants.windows.scrollBarWidth);
  }

  ngOnDestroy() {
    $('body').removeClass('fixed-hidden').css('padding-right', 0);
    $('#photo-box-detail').removeClass('active-info');
  }

  loadPost(uuid: string): void {
    this.loadItem(this.apiBaseServiceV2.urls.zoneSoPosts + '/' + uuid)
      .subscribe((response: any) => {
          this.item = response.data;
          this.itemDisplay = _.cloneDeep(this.item);
          this.classifyReactions();
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
    $('#photo-box-detail').toggleClass('active-info');
  }

  onBack() {
    this.router.navigate(['/zone/social']);
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

    console.log(this.itemDisplay);

  }

}

