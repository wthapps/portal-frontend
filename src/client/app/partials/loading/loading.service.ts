import {Injectable} from '@angular/core';


@Injectable()
export class LoadingService {
  /**
   * Add Class loading to element
   * @param {el} el - The ElementRef.
   * @param {timeout} Duration to wait before returning the element.
   */
  public start(el:Object, timeOut?:number) {
    if (typeof el.context !== 'undefined') {
      el.addClass('box-loading');
      if (timeOut) {
        setTimeout(()=> el.removeClass('box-loading'), 1000 * timeOut);
      }
    } else {
      el.classList.add('box-loading');
      if (timeOut) {
        setTimeout(()=> el.classList.remove('box-loading'), 1000 * timeOut);
      }
    }
  }

  /**
   * Remove Class loading to element
   * @param {el} el - The ElementRef.
   */
  public stop(el:Object) {
    if (typeof el.context !== 'undefined') {
      el.removeClass('box-loading');
    } else {
      el.classList.remove('box-loading');
    }
  }
}
