import { Injectable } from '@angular/core';
import { filter, map, take } from 'rxjs/operators';


import { SocialService } from './social.service';

declare let _: any;

@Injectable()
// This Data service is created for store Favorites data between components
export class SocialFavoriteService {
  public favorites: Array<any>;
  private loaded = false;

  constructor( private socialService: SocialService) {
    // Get initial data for favorite sections

    // this.loadFavourites();
  }

  loadFavourites(): Promise<any> {
    return this.socialService.user.getFavourites()
      .pipe(filter(() => !this.loaded)) // Only load data once
      .toPromise()
      .then(
      (res: any) => {
        this.favorites = res.data;
        this.loaded = true;
      }
    );
  }

  updateFavorite(item: any, type: any) {
    if (type !== 'community')
      return;
    this.favorites = _.map(this.favorites, (f: any) => { if (f[type] && f[type]['uuid'] === item.uuid)
      return Object.assign(item, {'community': item});
    else
      return f;
    });
  }


  addFavourite(uuid: any, type: any, localFavorite?: any): Promise<any> {
    return this.socialService.user.toggleFavourites(uuid, type).pipe(
      map((res: any) => {
        if (_.find(this.favorites, (f: any) => f.uuid === _.get(res, 'data.uuid'))) {
          this.removeFavorite(res.data);
        } else {
          this.addFavorite(res.data);
        }
        return res;
      }))
      .toPromise()
      .catch((err: any) => {
        console.log(`Error in addFavourite: ${err}`);
      });
  }




  removeFavorite(favorite: any) {
    _.remove(this.favorites, (f: any) => f.uuid === favorite.uuid);
  }

  unfavourite(favourite: any) {
    this.socialService.unfavourite(favourite.uuid).pipe(take(1))
      .toPromise().then((response: any) => {
        // _.remove(this.favourites.getValue(), (f: any) => f.uuid == favourite.uuid);
        this.removeFavorite(favourite);
      });
  }

  confirmLeaveCommunity(community: any) {
    this.socialService.community.confirmLeaveCommunity(community)
      .then((com) => _.remove(this.favorites, (f: any) => _.get(f, 'community.uuid', '') === com.uuid));
  }

  unfriend(friend: any) {
    this.socialService.user.unfriend(friend.uuid).toPromise().then(
      (res: any) => {
        _.remove(this.favorites, (f: any) => _.get(f, 'friend.uuid', '') === friend.uuid);
      },
    );
  }


  private addFavorite(favorite: any) {
    this.favorites.push(favorite);
  }


}
