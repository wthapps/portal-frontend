import {Component, OnInit, ChangeDetectorRef} from '@angular/core';

import {Router} from '@angular/router';

import {ToastsService} from './toast-message.service';
export interface IToast {
  id:string;
  type:string;
  createdOn:Date;
  title?:string;
  content?:string;
  override?:any;
  html?:any;
}

@Component({
  moduleId: module.id,
  selector: 'wth-toast',
  templateUrl: 'toast-message.component.html',
  styleUrls: ['toast-message.component.css']
})
export class SimpleToastsComponent implements OnInit {

  private maxStack:number = 5;
  private messageElement:any;

  private toasts:any = [];

  constructor(private _topMessageService:ToastsService, private _router:Router, private _cdr:ChangeDetectorRef) {
    _topMessageService.set = this.activate.bind(this);
  }

  activate(message:string, option?:IToast, type?:string) {
    this._cdr.detectChanges();
    let toast = {};
    toast.message = message;
    toast.type = type;
    toast.option = option;
    toast.id = Date.now();

    if (option.lastOnBottom) {
      // new item at bottom
      if (this.toasts.length >= this.maxStack) this.toasts.shift();
      this.toasts.push(toast);
    } else {
      // new item at top
      if (this.toasts.length >= this.maxStack) this.toasts.pop();
      this.toasts.unshift(toast);
    }

    let promise = new Promise<boolean>((resolve, reject) => {
      this.show();
    });
    return promise;
  }

  ngOnInit() {
    this.toasts = [];
    this._router.changes.subscribe((val) => this.hideDialog());
    this.messageElement = document.getElementById('toast-wrap');
  }

  startTimeOut() {
    this.timer = setTimeout(this.instance, this.speed);
  }

  ngOnDestroy() {
    clearTimeout(this.timer)
  }

  private show() {
    if (!this.messageElement) {
      return;
    }
    this.messageElement.style.display = 'block';
  }

  private hideDialog() {
    this.toasts = [];
    this.messageElement.style.display = 'none';
    this.messageElement.classList.remove('in');
  }

  removeSelf($event) {
    let target = $event.target || $event.srcElement || $event.currentTarget;
    let idAttr = target.attributes.id;
    let value = +idAttr.nodeValue.replace('data-alert-', '');
    this.toasts.splice(value, 1);
  }

}
