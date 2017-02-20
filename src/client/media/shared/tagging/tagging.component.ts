import { Component, OnInit, ViewChild, Input } from '@angular/core';

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
  removedTags: any = [];

  constructor(private taggingService: ZMediaTaggingService) {
  }

  ngOnInit() {
    this.getAllTags();
    this.getCurrentTags();
  }

  getAllTags() {
    this.taggingService.getAll().subscribe(
      (res: any)=> {
        this.dataTags = _.map(res.data, 'name');
      });
  }

  getCurrentTags() {
    let body = JSON.stringify({objects: _.map(this.selectedItems, 'id'), type: this.getType()});
    this.taggingService.getByItem(body).subscribe(
      (res: any)=> {
        console.log(res);
        this.addedTags = res.data;
      },
      (error: any) => {
        console.log('error', error);
      });
  }

  save() {
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
