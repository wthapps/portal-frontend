import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { ZMediaTaggingService } from './tagging.service';
import { TaggingElComponent } from './tagging-el.component';


declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'tagging-modal',
  templateUrl: 'tagging-modal.component.html'
})
export class TaggingModalComponent implements OnInit, BaseMediaModal {
  @ViewChild('modal') modal: ModalComponent;
  @ViewChild('tag') tag: TaggingElComponent;
  @Input() selectedItems: any = [];
  @Input() mediaType: string = 'photo';
  @Input() items: any = [];
  @Input() objects: any = [];
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  newTags: any = [];
  addedTags: any = [];
  currentTags: any = [];
  removedTags: any = [];
  keys: string = '';
  selectedObjects:any;
  updateListObjects:any;

  hasDeletedItems: boolean = false;

  constructor(private taggingService: ZMediaTaggingService) {
  }

  ngOnInit() {

  }

  save() {
    let tagsName:any = [];
    for (let i = 0; i < this.tag.addedTags.length; i++) {
      if (typeof this.tag.addedTags[i] == 'object') {
        tagsName.push(this.tag.addedTags[i].display);
      } else {
        tagsName.push(this.tag.addedTags[i]);
      }
    }
    for (let i = 0; i < this.selectedObjects.length; i++) {
      this.taggingService.save({tags_name: tagsName, object_id: this.selectedObjects[i].id, object_type: this.selectedObjects[i].object_type}).subscribe(
        (res:any) => {
          // Update objects
          if (this.updateListObjects) {
            for(let j = 0; j < this.updateListObjects.length; j++) {
              for(let k = 0; k < this.updateListObjects[j].length; k++) {
                if (res.data.id == this.updateListObjects[j][k].id) {
                  this.updateListObjects[j][k] = res.data;
                }
              }
            }
          }
        }
      );
    }
  }

  open(options?: any) {
    this.selectedObjects = options.selectedObjects;
    this.updateListObjects = options.updateListObjects;
    this.tag.addedTags = [];
    if (this.selectedObjects.length == 1) {
      for (let i = 0; i < this.selectedObjects[0].json_tags.length; i++) {
        this.tag.addedTags.push(this.selectedObjects[0].json_tags[i].name);
      }
    }
    console.log(this.selectedObjects, this.updateListObjects, this.tag.addedTags);
    this.modal.open();
  }

  close(options: any) {
    this.modal.close();
  }

}
