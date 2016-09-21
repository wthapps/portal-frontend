import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {ZPhotoDetailComponent} from './photo-detail.component'


@Component({
  moduleId: module.id,
  selector: 'page-zone-photo',
  templateUrl: 'photo-list.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    ZPhotoDetailComponent
  ]
})

export class ZPhotoListComponent {
  showImg: boolean = false;

  imgSrcDetail: string = '/assets/images/zone/img-default.png';

  dataImages: Array<any> = [
    {
      id: 1,
      img_thumb: 'http://www.catprotection.com.au/wp-content/uploads/2014/11/5507692-cat-m.jpg',
      img_large: 'http://www.catprotection.com.au/wp-content/uploads/2014/11/5507692-cat-m.jpg'
    },
    {
      id: 2,
      img_thumb: 'https://s-media-cache-ak0.pinimg.com/736x/a9/a3/46/a9a34606f68f5f86aa94833ad482e4c9.jpg',
      img_large: 'https://s-media-cache-ak0.pinimg.com/736x/a9/a3/46/a9a34606f68f5f86aa94833ad482e4c9.jpg'
    },
    {
      id: 3,
      img_thumb: 'http://static.boredpanda.com/blog/wp-content/uploads/2015/06/pallas-cat-manul-14__880.jpg',
      img_large: 'http://static.boredpanda.com/blog/wp-content/uploads/2015/06/pallas-cat-manul-14__880.jpg'
    }
  ];

  onClick(src): void {
    this.imgSrcDetail = src;
    this.showImg = true;
  }

  onHideModalClicked(img: string): void {
    if (img) {
      this.showImg = false;
    }
  }

}
