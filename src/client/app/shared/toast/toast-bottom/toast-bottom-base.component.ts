import {EventEmitter, OnChanges, OnInit} from "@angular/core";

export abstract class ToastBottomBase {
  hideToast: EventEmitter;
  close() {
    this.hideToast.emit();
  }
}
