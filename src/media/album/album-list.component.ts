import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as appStore from '../shared/store';
import * as fromAlbum from '../shared/store/album/album.action';


@Component({
  selector: 'z-media-album-list',
  templateUrl: 'album-list.component.html'
})
export class AlbumListComponent implements OnInit {
  albums: Observable<any>;

  constructor(private store: Store<appStore.State>
  ) {
    this.albums = this.store.select(appStore.selectAlbums);
  }

  ngOnInit() {
    this.store.dispatch(new fromAlbum.GetAll());
  }

  doEvent(event: any) {
    switch (event.type) {
      case 'loadMore':
        console.log('event actions:::', event.action);
    }
  }
}
