import {Component, OnInit} from '@angular/core';

import {DialogService} from './dialog.service';

const KEY_ESC = 27;

@Component({
  moduleId: module.id,
  selector: 'wth-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['dialog.component.css']
})
export class DialogComponent implements OnInit {
  longModal:boolean;
  title:string;
  message:string;
  okText:string;
  cancelText:string;
  negativeOnClick:(e:any) => void;
  positiveOnClick:(e:any) => void;

  private defaults = {
    longModal: false,
    title: 'Confirmation',
    message: 'Are you sure?',
    cancelText: 'Cancel',
    okText: 'OK'
  };
  private bodyElement:any;
  private modalElement:any;
  private modalElementBackdrop:any;
  private cancelButton:any;
  private okButton:any;

  constructor(_dialogService:DialogService) {
    _dialogService.activate = this.activate.bind(this);
  }

  activate(message = this.defaults.message,
           title = this.defaults.title,
           okText = this.defaults.okText,
           cancelText = this.defaults.cancelText,
           longModal = this.defaults.longModal) {
    this.title = title;
    this.message = message;
    this.okText = okText;
    this.cancelText = cancelText;
    this.longModal = longModal;

    let promise = new Promise<boolean>((resolve, reject) => {
      this.negativeOnClick = (e:any) => resolve(false);
      this.positiveOnClick = (e:any) => resolve(true);
      this.show();
    });

    return promise;
  }

  ngOnInit() {
    this.bodyElement = document.body;
    this.modalElement = document.getElementById('confirmationModal');
    this.modalElementBackdrop = document.getElementById('confirmationModal-backdrop');
    this.cancelButton = document.getElementById('cancelButton');
    this.okButton = document.getElementById('okButton');
  }

  private show() {
    document.onkeyup = null;

    if (!this.modalElement || !this.cancelButton || !this.okButton) {
      return;
    }

    this.modalElementBackdrop.classList.add('in');
    //this.modalElement.style.opacity = 0;
    //this.modalElement.style.zIndex = 9999;

    this.cancelButton.onclick = ((e:any) => {
      e.preventDefault();
      if (!this.negativeOnClick(e)) {
        this.hideDialog();
      }
    });

    this.okButton.onclick = ((e:any) => {
      e.preventDefault();
      if (!this.positiveOnClick(e)) {
        this.hideDialog();
      }
    });

    this.modalElement.onclick = () => {
      this.hideDialog();
      return this.negativeOnClick(null);
    };

    document.onkeyup = (e:any) => {
      if (e.which === KEY_ESC) {
        this.hideDialog();
        return this.negativeOnClick(null);
      }
    };

    //this.modalElement.style.opacity = 1;
    this.bodyElement.classList.add('modal-open');
    this.modalElement.classList.add('in');
    this.modalElement.style.display = 'block';
    this.bodyElement.style.paddingRight = this.getScrollbarWidth()+'px';
  }

  private hideDialog() {
    document.onkeyup = null;
    //this.modalElement.style.opacity = 0;
    //window.setTimeout(() => this.modalElement.style.zIndex = 0, 400);
    this.bodyElement.classList.remove('modal-open');
    this.modalElement.style.display = 'none';
    this.modalElement.classList.remove('in');
    this.modalElementBackdrop.classList.remove('in');
    this.bodyElement.style.paddingRight = 0;
  }

  private getScrollbarWidth() {
    var outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = 'scroll';

    // add innerdiv
    var inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
  }
}
