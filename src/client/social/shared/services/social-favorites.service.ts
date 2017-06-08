import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocialService } from './social.service';
declare let _ : any;

@Injectable()
// This Data service is created for store Favorites data between components
export class SocialFavoriteService {
  // public favoritesObs: any;
  // public favorites: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public favorites: Array<any>;
  private loaded: boolean = false;

  constructor( private socialService: SocialService) {
    // Get initial data for favorite sections

    this.getFavourites();
  }

  getFavourites() {
    this.socialService.user.getFavourites()
      .filter(() => !this.loaded) // Only load data once
      .take(1).subscribe(
      (res: any) => {
        this.favorites = res.data;
        this.loaded = true;
      }
    );

  }


  addFavourite(uuid: any, type: any, localFavorite?: any) {
    this.socialService.user.toggleFavourites(uuid, type)
      .toPromise()
      .then((res: any) => {
        if(_.find(this.favorites, (f: any) => f.uuid == _.get(res, 'data.uuid'))) {
          this.removeFavorite(res.data);
          if (localFavorite != undefined)
            localFavorite = undefined;
        } else {
          this.addFavorite(res.data);
          if (localFavorite != undefined)
            localFavorite = res.data;
        }})
        .catch((err: any) => console.error(`Error in addFavourite: ${err}`))
      ;
  }




  removeFavorite(favorite: any) {
    _.remove(this.favorites, (f: any) => f.uuid == favorite.uuid);
  }

  unfavourite(favourite: any) {
    this.socialService.unfavourite(favourite.uuid).take(1)
      .subscribe((response: any) => {
        // _.remove(this.favourites.getValue(), (f: any) => f.uuid == favourite.uuid);
        this.removeFavorite(favourite);
      });
  }

  confirmLeaveCommunity(community: any) {
    this.socialService.community.confirmLeaveCommunity(community)
      .then((community: any) => _.remove(this.favorites, (f: any) => _.get(f, 'community.uuid', '') == community.uuid));
  }

  unfriend(friend: any) {
    this.socialService.user.unfriend(friend.uuid).subscribe(
      (res: any) => {
        _.remove(this.favorites, (f: any) => _.get(f, 'friend.uuid', '') == friend.uuid);
      },
    );
  }


  private addFavorite(favorite: any) {
    this.favorites.push(favorite);
  }


}
