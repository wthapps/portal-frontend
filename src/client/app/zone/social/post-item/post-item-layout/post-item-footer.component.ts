import { Component, ViewChild, OnInit, Input, OnChanges } from '@angular/core';
import { BaseZoneSocialItem } from "../../base/base-social-item";
import { SoPost } from "../../../../shared/models/social_network/so-post.model";

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-item-footer',
  templateUrl: 'post-item-footer.component.html',
  host: {
    // '(document:keydown)': 'onDocumentKeyDown($event)',
    // '(document:keyup)': 'onDocumentKeyUp($event)'
  }
})

export class ZSocialPostItemFooterComponent extends BaseZoneSocialItem implements OnChanges{
  @Input() item: SoPost;
  @Input() type: string;

  showInfo: boolean = false;

  ngOnChanges() {
    if (this.type == 'info') {
      this.showInfo = true;
    }
  }

  // onDocumentKeyDown(ev: KeyboardEvent) {
  //   console.log(ev);
  //   // if (ev.keyCode == 17 || ev.keyCode == 18 || ev.keyCode == 91 || ev.keyCode == 93 || ev.ctrlKey) {
  //   //   this.keyCtrl = true;
  // }
  onKey(e: KeyboardEvent) {
    if (e.keyCode == 13 && e.target.value != "") {
      console.log('create ' + e.target.value);
    }
  }
}
