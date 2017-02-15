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

  constructor(private taggingService: ZMediaTaggingService) {
  }

  ngOnInit() {

  }
}
