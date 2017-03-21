import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { ZMediaTaggingService } from './tagging.service';


declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-share-tagging',
  templateUrl: 'tagging.component.html'
})
export class ZMediaTaggingComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  @Input() selectedItems: any = [];
  @Input() mediaType: string = 'photo';
  dataTags: any = [];

  newTags: any = [];
  addedTags: any = [];
  currentTags: any = [];
  removedTags: any = [];

  hasDeletedItems: boolean = false;


  constructor(private taggingService: ZMediaTaggingService) {
  }

  ngOnInit() {
    this.getAllTags();
    this.getCurrentTags();
  }

  getAllTags() {
    this.taggingService.getAll().subscribe(
      (res: any)=> {
        console.log(res);
        this.dataTags = _.map(res.data, 'name');
      },
      (error: any) => {
        console.log('error', error);
      });
  }

  // requestAutocompleteItems = (text: string): Observable<Response> => {
  //   const url = `https://my.api.com/search?q=${text}`;
  //   return this.http
  //     .get(url)
  //     .map(data => data.json());
  // };

  getCurrentTags() {
    let body = JSON.stringify({objects: _.map(this.selectedItems, 'id'), type: this.getType()});
    this.taggingService.getByItem(body).subscribe(
      (res: any)=> {
        console.log(res);
        this.addedTags = res.data;
        this.currentTags = res.data;
      },
      (error: any) => {
        console.log('error', error);
      });
  }

  save() {
    this.removedTags.length = 0;

    this.newTags = _.difference(this.addedTags, this.dataTags);

    let _this = this;
    _.map(this.currentTags, (v: any)=> {
      if (_this.addedTags.indexOf(v) == -1) {
        _this.removedTags.push(v);
      }
    });

    let body = JSON.stringify({
      objects: _.map(this.selectedItems, 'id'),
      type: this.getType(),
      newTags: this.newTags,
      addedTags: this.addedTags,
      removedTags: this.removedTags
    });
    console.log(body);
  }

  private getType(): number {
    if (this.mediaType == 'photo') {
      return 1;
    }
    if (this.mediaType == 'album') {
      return 2;
    }
    if (this.mediaType == 'albumDetail') {
      return 2;
    }
    return 1;
  }
}
