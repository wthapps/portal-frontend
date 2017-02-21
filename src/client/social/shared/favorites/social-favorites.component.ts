import { Component, OnInit } from '@angular/core';

import { SocialService } from '../services/social.service';
import { Constants } from '../../../core/shared/config/constants';

@Component({
  moduleId: module.id,
  selector: 'z-social-favorites',
  templateUrl: 'social-favorites.component.html'
})

export class ZSocialFavoritesComponent implements OnInit {

  favourites: any = [];
  readonly profileUrl: string = '/' + Constants.urls.profile;
  readonly communitiesUrl: string = '/' + Constants.urls.communities;

  constructor(private socialService: SocialService) {

  }

  ngOnInit() {
    this.socialService.user.getFavourites().subscribe(
      (res: any) => {
        this.favourites = res.data;
      }
    );
  }
}
