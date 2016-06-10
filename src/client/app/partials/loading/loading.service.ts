import {Injectable} from '@angular/core';


@Injectable()
export class LoadingService {
  /*
   activate:(root?:string) => Promise<boolean>;
   */
  private el = document.getElementById("preloader-wrap");

  public start() {
    this.el.classList.add('active');
  }

  public stop() {
    this.el.classList.remove('active');
  }
}
