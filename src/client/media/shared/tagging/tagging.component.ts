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
  values: string[];
  dataTags: string[];

  constructor(private taggingService: ZMediaTaggingService) {
  }

  ngOnInit() {
    console.log(this.taggingService);
    this.taggingService.getAll().subscribe(
      (res: any)=> {
        this.dataTags = _.map(res.data, 'name');
      });
  }
}
