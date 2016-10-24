import {EventEmitter, OnChanges, OnInit} from "@angular/core";
import {FormManagerService} from "../form/form-manager.service";

declare var $: any;

export abstract class ToastBase{
  formManagerService: FormManagerService;
  toastId:string;

  constructor(toastId: string) {
    this.toastId = toastId;
  }

  close() {
    this.formManagerService.hide(this.toastId);
  }
}
