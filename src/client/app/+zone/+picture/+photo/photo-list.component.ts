import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {ZPhotoDetailComponent} from './photo-detail.component'

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-photo',
  templateUrl: 'photo-list.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    ZPhotoDetailComponent
  ]
})

export class ZPhotoListComponent implements OnInit {
  showImg: boolean = false;

  imgSrcDetail: string = '/assets/images/zone/img-default.png';

  sortName: any = false;
  sortDate: any = false;

  dataImages: Array<any> = [
    {
      id: 1,
      img_thumb: 'http://www.catprotection.com.au/wp-content/uploads/2014/11/5507692-cat-m.jpg',
      img_large: 'http://www.catprotection.com.au/wp-content/uploads/2014/11/5507692-cat-m.jpg',
      name: 'a',
      owner: 'me',
      date: '11/11/2010',
      size: '11kb'
    },
    {
      id: 2,
      img_thumb: 'https://s-media-cache-ak0.pinimg.com/736x/a9/a3/46/a9a34606f68f5f86aa94833ad482e4c9.jpg',
      img_large: 'https://s-media-cache-ak0.pinimg.com/736x/a9/a3/46/a9a34606f68f5f86aa94833ad482e4c9.jpg',
      name: 'c',
      owner: 'me',
      date: '12/11/2010',
      size: '11kb'
    },
    {
      id: 3,
      img_thumb: 'http://static.boredpanda.com/blog/wp-content/uploads/2015/06/pallas-cat-manul-14__880.jpg',
      img_large: 'http://static.boredpanda.com/blog/wp-content/uploads/2015/06/pallas-cat-manul-14__880.jpg',
      name: 'b',
      owner: 'me',
      date: '14/11/2010',
      size: '11kb'
    },
    {
      id: 4,
      img_thumb: 'http://static.boredpanda.com/blog/wp-content/uploads/2015/06/pallas-cat-manul-14__880.jpg',
      img_large: 'http://static.boredpanda.com/blog/wp-content/uploads/2015/06/pallas-cat-manul-14__880.jpg',
      name: 'c',
      owner: 'me',
      date: '14/11/2010',
      size: '11kb'
    },
    {
      id: 5,
      img_thumb: 'http://static.boredpanda.com/blog/wp-content/uploads/2015/06/pallas-cat-manul-14__880.jpg',
      img_large: 'http://static.boredpanda.com/blog/wp-content/uploads/2015/06/pallas-cat-manul-14__880.jpg',
      name: 'd',
      owner: 'me',
      date: '14/11/2010',
      size: '11kb'
    },
    {
      id: 6,
      img_thumb: 'http://static.boredpanda.com/blog/wp-content/uploads/2015/06/pallas-cat-manul-14__880.jpg',
      img_large: 'http://static.boredpanda.com/blog/wp-content/uploads/2015/06/pallas-cat-manul-14__880.jpg',
      name: 'e',
      owner: 'me',
      date: '18/11/2010',
      size: '11kb'
    }
  ];


  ngOnInit(): void {
    this.dataImages = _.orderBy(this.dataImages, ['date'], ['desc']);
  }

  onClick(src): void {
    this.imgSrcDetail = src;
    this.showImg = true;
  }

  onHideModalClicked(img: string): void {
    if (img) {
      this.showImg = false;
    }
  }

  /*sort(event, column) {
    if (column == 'name') {
      this.sortName = (this.sortName == 'asc' ? 'desc' : 'asc');
    } else {
      this.sortDate = (this.sortDate == 'asc' ? 'desc' : 'asc');
    }
    this.dataImages = _.orderBy(this.dataImages, ['name', 'date'], [this.sortName, this.sortDate]);
  }*/

  /**
   * 
   * @param event
   * @param column
     */
  sort(event, column) {
    if (column == 'name') {
      this.sortName = (this.sortName == false || this.sortName == 'asc'  ? 'desc' : 'asc');
      this.dataImages = _.orderBy(this.dataImages, [column], [this.sortName]);
      this.sortDate = false;
    } else {
      this.sortDate = (this.sortDate == false || this.sortDate == 'asc' ? 'desc' : 'asc');
      this.dataImages = _.orderBy(this.dataImages, [column], [this.sortDate]);
      this.sortName = false;
    }

  }

}
