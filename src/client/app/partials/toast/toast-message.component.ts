import { Component, OnInit, } from '@angular/core';

import { Message } from 'primeng/primeng';

import { ToastsService } from './toast-message.service';

@Component({
  moduleId: module.id,
  selector: 'wth-toast',
  templateUrl: 'toast-message.component.html',
  styleUrls: ['toast-message.component.css']
})
export class ToastsComponent implements OnInit {
  msgs: Message[] = [];
  life: number = 3000000;

  constructor(private toastsService: ToastsService) {
    toastsService.set = this.activate.bind(this);
  }

  activate(icon: string, summary: string, detail: string) {
    let promise = new Promise<boolean>((resolve, reject) => {
      this.show(icon, summary, detail);
    });
    return promise;
  }

  ngOnInit() {
    this.msgs = [];
  }

  private show(icon: string, summary: string, detail: string) {
    this.msgs.push({severity: icon, summary: summary, detail: detail});
  }
}
