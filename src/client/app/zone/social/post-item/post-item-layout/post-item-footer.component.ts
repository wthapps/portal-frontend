import { Component, ViewChild, OnInit, Input } from '@angular/core';
import {BaseZoneSocialItem} from "../../base/base-social-item";
import {SoPost} from "../../../../shared/models/social_network/so-post.model";

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

export class ZSocialPostItemFooterComponent extends BaseZoneSocialItem{
  @Input() item: SoPost;

  // onDocumentKeyDown(ev: KeyboardEvent) {
  //   console.log(ev);
  //   // if (ev.keyCode == 17 || ev.keyCode == 18 || ev.keyCode == 91 || ev.keyCode == 93 || ev.ctrlKey) {
  //   //   this.keyCtrl = true;
  // }
  onKey(e:KeyboardEvent) {
    if(e.keyCode == 13 && e.target.value != "") {
      console.log('create ' + e.target.value);
    }
  }
}
