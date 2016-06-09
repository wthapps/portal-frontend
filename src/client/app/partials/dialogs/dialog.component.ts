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
  title:string;
  message:string;
  okText:string;
  cancelText:string;
  negativeOnClick:(e:any) => void;
  positiveOnClick:(e:any) => void;

  private defaults = {
    title: 'Confirmation',
    message: 'Are you sure?',
    cancelText: 'Cancel',
    okText: 'OK'
  };
  private modalElement:any;
  private modalElementBackdrop:any;
  private cancelButton:any;
  private okButton:any;

  constructor(_dialogService:DialogService) {
    _dialogService.activate = this.activate.bind(this);
  }

  activate(message = this.defaults.message, title = this.defaults.title, okText = this.defaults.okText, cancelText = this.defaults.cancelText) {
    this.title = title;
    this.message = message;
    this.okText = okText;
    this.cancelText = cancelText;

    let promise = new Promise<boolean>((resolve, reject) => {
      this.negativeOnClick = (e:any) => resolve(false);
      this.positiveOnClick = (e:any) => resolve(true);
      this.show();
    });

    return promise;
  }

  ngOnInit() {
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
    this.modalElement.classList.add('in');
    this.modalElement.style.display = 'block';
  }

  private hideDialog() {
    document.onkeyup = null;
    //this.modalElement.style.opacity = 0;
    //window.setTimeout(() => this.modalElement.style.zIndex = 0, 400);

    this.modalElement.style.display = 'none';
    this.modalElement.classList.remove('in');
    this.modalElementBackdrop.classList.remove('in');
  }
}
