import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { ZMediaTaggingService } from './tagging.service';
import { TaggingElComponent } from './tagging-el.component';
import { WthAppsBaseModal } from '../../../../interfaces/wthapps-base-modal';


declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'tagging-modal',
  templateUrl: 'tagging-modal.component.html'
})
export class TaggingModalComponent implements OnInit {
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
  selectedObjects: any;
  updateListObjects: any;
  updateObject: any;
  toolbar: any;

  hasDeletedItems: boolean = false;

  constructor(private taggingService: ZMediaTaggingService) {
  }

  ngOnInit() {

  }

  update(res: any) {
    if (res.data && this.selectedObjects && this.selectedObjects.length > 0 && this.updateListObjects && this.updateListObjects.length > 0) {
      if (this.selectedObjects.length == 1) {
        res.data = [res.data];
      }
      for (let i = 0; i < this.selectedObjects.length; i++) {
        if (res.data[i]) {
          if (this.updateListObjects) {
            for(let j = 0; j < this.updateListObjects.length; j++) {
              for(let k = 0; k < this.updateListObjects[j].length; k++) {
                if (res.data[i].id == this.updateListObjects[j][k].id) {
                  this.updateListObjects[j][k] = res.data[i];
                }
              }
            }
          }
          if (this.updateObject) {
            if (res.data.id == this.updateObject.id) {
              this.updateObject = res.data[i];
            }
          }
          if (this.toolbar) {
            this.toolbar.updateProperties({object: res.data[i]});
          }
        }
      }
    }

  }

  save() {
    let tagsName: any = [];
    for (let i = 0; i < this.tag.addedTags.length; i++) {
      if (typeof this.tag.addedTags[i] == 'object') {
        tagsName.push(this.tag.addedTags[i].display);
      } else {
        tagsName.push(this.tag.addedTags[i]);
      }
    }

    if (this.selectedObjects.length == 1) {
      this.taggingService.save({tags_name: tagsName, object: this.selectedObjects[0]}).subscribe(
        (res: any) => {
          // Update objects
          this.update(res);
        }
      );
    }

    if (this.selectedObjects.length > 1) {
      this.taggingService.saveMultiple({tags_name: tagsName, objects: this.selectedObjects}).subscribe(
        (res: any) => {
          // Update objects
          this.update(res);
        }
      );
    }
  }

  open(options?: any) {
    this.selectedObjects = options.selectedObjects;
    this.updateListObjects = options.updateListObjects;
    this.updateObject = options.updateObject;
    this.toolbar = options.toolbar;

    this.tag.addedTags = [];
    if (this.selectedObjects.length == 1) {
      for (let i = 0; i < this.selectedObjects[0].json_tags.length; i++) {
        this.tag.addedTags.push(this.selectedObjects[0].json_tags[i].name);
      }
    }
    this.modal.open();
  }

  close(options: any) {
    this.modal.close();
  }

}
