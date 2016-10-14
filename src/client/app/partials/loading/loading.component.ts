import { Component } from '@angular/core';

import { LoadingService } from './loading.service';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'wth-loading',
  templateUrl: 'loading.component.html',
  styleUrls: ['loading.component.css']
})
export class LoadingComponent {
  display: boolean = false;

  constructor(private loadingService: LoadingService) {
    loadingService.set = this.activate.bind(this);
  }

  ngOnInit() {
    this.display = false;
  }

  activate(action: boolean, el: string) {
    let promise = new Promise<boolean>((resolve, reject) => {
      this.show(action, el);
    });
    return promise;
  }

  private show(action: boolean, el: string) {
    if (el && $(el).length) {
      if (action) {
        $(el).wrap('<div class="inside-loading"></div>');
      } else {
        $(el).unwrap();
      }
    } else {
      this.display = action;
    }
  }
}
