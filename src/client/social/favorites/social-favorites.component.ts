// import { Component, OnInit } from '@angular/core';
// import { SocialService } from '../shared/services/social.service';
// import { Constants } from '../../core/shared/config/constants';
//
// @Component({
//   moduleId: module.id,
//   selector: 'z-social-favorites',
//   templateUrl: 'social-favorites.component.html'
// })
//
// export class ZSocialFavoritesComponent implements OnInit {
//
//   favourites: any = [];
//   readonly soProfileUrl: string = '/' + Constants.urls.zoneSoProfile;
//   readonly soCommunitiesUrl: string = '/' + Constants.urls.zoneSoCommunities;
//
//   constructor(private socialService: SocialService) {
//
//   }
//
//   ngOnInit() {
//     this.socialService.user.getFavourites().subscribe(
//       (res: any) => {
//         this.favourites = res.data;
//       }
//     );
//   }
// }
