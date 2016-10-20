import {EventEmitter, OnChanges, OnInit} from "@angular/core";

export abstract class ToastBottomBase {
  showToast:boolean;
  hideToast: EventEmitter;
  close() {
    this.hideToast.emit();
  }
}
