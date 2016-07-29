import {
  Injectable,
  OnChanges,
  ElementRef
}                               from '@angular/core';

declare var $:any;

@Injectable()
export class LoadingService implements OnChanges {
  /**
   * Add Class loading to element
   * @param {el} el - The ElementRef.
   * @param {timeout} Duration to wait before returning the element.
   */
  /*public start(el:Object, timeOut?:number = 10) {
   if (typeof el.context !== 'undefined') {
   el.addClass('box-loading');
   setTimeout(()=> el.removeClass('box-loading'), 1000 * timeOut);
   } else {
   el.classList.add('box-loading');
   setTimeout(()=> el.classList.remove('box-loading'), 1000 * timeOut);
   }
   }*/

  private modalElement:any;
  private modalElementBackdrop:any;

  constructor(private ElementRef:ElementRef) {
    this.modalElement = document.getElementById('loadingModal');
    this.modalElementBackdrop = document.getElementById('loadingModal-backdrop');
  }

  ngOnChanges():void {
    this.stop();
  }

  public start(el?:string) {
    if (el) {
      $(this.ElementRef.nativeElement).find(el).wrap('<div class="inside-loading"></div>');
    } else {
      this.modalElement.style.display = 'block';
      this.modalElement.classList.add('in');
      this.modalElement.classList.add('in-loading');
      this.modalElementBackdrop.classList.add('in');
    }
  }


  /**
   * Remove Class loading to element
   * @param {el} el - The ElementRef.
   */
  /*public stop(el:Object) {
   if (typeof el.context !== 'undefined') {
   el.removeClass('box-loading');
   } else {
   el.classList.remove('box-loading');
   }
   }*/

  public stop(el?:string) {
    if (el) {
      $(this.ElementRef.nativeElement).find(el).unwrap();
    } else {
      this.modalElement.style.display = 'none';
      this.modalElement.classList.remove('in');
      this.modalElement.classList.remove('in-loading');
      this.modalElementBackdrop.classList.remove('in');
    }
  }
}
