import { Component, OnInit } from '@angular/core';
import { SocialService } from '../services/social.service';

@Component({
  moduleId: module.id,
  selector: 'z-social-favorites',
  templateUrl: 'social-favorites.component.html'
})

export class ZSocialFavoritesComponent implements OnInit{

  constructor(private socialService: SocialService) {

  }

  ngOnInit() {
    this.socialService.user.getFavorites().subscribe(

    );
  }

}
