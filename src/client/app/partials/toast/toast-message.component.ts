import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';

import {Router} from '@angular/router';

import {ToastsService} from './toast-message.service';
import {ToastOptions} from './toast-message';

@Component({
  moduleId: module.id,
  selector: 'wth-toast',
  templateUrl: 'toast-message.component.html',
  styleUrls: ['toast-message.component.css']
})
export class SimpleToastsComponent implements OnInit, OnDestroy {

  maxStack:number = 5;
  messageElement:any;

  toasts:any = [];

  constructor(private toastsService:ToastsService, private _router:Router, private _cdr:ChangeDetectorRef) {
    toastsService.set = this.activate.bind(this);
  }

  activate(message:string, option:ToastOptions, type:string) {
    let toast = {
      message: message,
      option: option,
      type: type,
      id: Date.now()
    };

    if (option.lastOnBottom) {
      // new item at bottom
      if (this.toasts.length >= this.maxStack) this.toasts.shift();
      this.toasts.push(toast);
    } else {
      // new item at top
      if (this.toasts.length >= this.maxStack) this.toasts.pop();
      this.toasts.unshift(toast);
    }

    this._cdr.detectChanges();

    let promise = new Promise<boolean>((resolve, reject) => {
      this.show();
    });
    return promise;
  }

  ngOnInit() {
    this.toasts = [];
    this._router.events.subscribe((val) => this.hideDialog());
    this.messageElement = document.getElementById('toast-wrap');
  }

  startTimeOut() {
    //this.timer = setTimeout(this.instance, this.speed);
  }

  removeSelf($event:any) {
    let target = $event.target || $event.srcElement || $event.currentTarget;
    let idAttr = target.attributes.id;
    let value = +idAttr.nodeValue.replace('data-alert-', '');
    this.toasts.splice(value, 1);
  }

  ngOnDestroy() {
    //clearTimeout(this.timer);
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
}
