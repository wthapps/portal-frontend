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
  @Input() items: any;
  dataTags: any = [];

  newTags: any = [];
  addedTags: any = [];
  currentTags: any = [];
  removedTags: any = [];
  keys: string = '';

  hasDeletedItems: boolean = false;


  constructor(private taggingService: ZMediaTaggingService) {
  }

  ngOnInit() {

  }

  save() {
    let tagsName:any = [];
    for (let i = 0; i < this.addedTags.length; i++) {
      if (typeof this.addedTags[i] == 'object') {
        tagsName.push(this.addedTags[i].display);
      } else {
        tagsName.push(this.addedTags[i]);
      }
    }
    for (let i = 0; i < this.selectedItems.length; i++) {
      this.taggingService.save({tags_name: tagsName, object_id: this.selectedItems[i].id, object_type: this.mediaType}).subscribe(
        (res:any) => {
          for(let j = 0; j < this.items.length; j++) {
            if (res.data.id == this.items[j].id) {
              this.items[j] = res.data;
            }
          }
        }
      );
    }
  }

  open() {
    if (this.selectedItems.length == 1) {
      this.addedTags = [];
      for (let i = 0; i < this.selectedItems[0].json_tags.length; i++) {
        this.addedTags.push(this.selectedItems[0].json_tags[i].name);
      }
    } else {
      this.addedTags = [];
    }
    this.modal.open();
  }

  onKeyDown(e:any) {
    if (e.key == 'Backspace') {
      this.keys = this.keys.substring(0, this.keys.length - 1);
    }
    if (e.key == 'Enter') {
      this.keys = '';
    }
    if (e.key.length == 1) {
      this.keys += e.key;
    }
    if (this.keys.length > 0) {
      this.taggingService.getTags(this.keys).subscribe(
        (res: any)=> {
          this.dataTags = _.map(res.data, 'name');
        }
      );
    }
  }
}
