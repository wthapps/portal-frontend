import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { ZMediaTaggingService } from './tagging.service';


declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'tagging-modal',
  templateUrl: 'tagging-modal.component.html'
})
export class TaggingModalComponent implements OnInit, BaseMediaModal {
  @ViewChild('modal') modal: ModalComponent;
  @Input() selectedItems: any = [];
  @Input() mediaType: string = 'photo';
  @Input() items: any;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  newTags: any = [];
  addedTags: any = [];
  currentTags: any = [];
  removedTags: any = [];
  keys: string = '';

  hasDeletedItems: boolean = false;

  public requestAutocompleteItems = (text: string): Observable<Response> => {
    return this.taggingService.getTags(text).map((res:any) => _.map(res.data, 'name'));
  }

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

  open(options?: any) {
    this.addedTags = [];
    if (this.selectedItems.length == 1) {
      for (let i = 0; i < this.selectedItems[0].json_tags.length; i++) {
        this.addedTags.push(this.selectedItems[0].json_tags[i].name);
      }
    }
    this.modal.open();
  }

  close(options: any) {
    this.modal.close();
  }

}
