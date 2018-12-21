import { Directive, ElementRef, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

/**
 * # Ways to turn off autofocus: any js-falsely value, except empty string
 *
 *     <!-- with data binding -->
 *     <input [autofocus]=""> <!-- undefined value -->
 *     <input [autofocus]="undefined">
 *     <input [autofocus]="false">
 *     <input [autofocus]="null">
 *     <input [autofocus]="0">
 *
 *     <!-- without data binding -->
 *     <input autofocus="undefined">
 *     <input autofocus="false">
 *     <input autofocus="null">
 *     <input autofocus="0">
 *
 *     <input> <!-- disabled by default -->
 *
 *
 * # Ways to enable autofocus: any js-true value and empty string
 *
 *
 *     <!-- empty string will enable autofocus, this is default html behavior -->
 *     <input [autofocus]="''">
 *     <input autofocus="">
 *     <input autofocus>
 *
 *     <input [autofocus]="true">
 *     <input autofocus="true">
 *
 *     <input [autofocus]="'any other values'">
 *
 */
@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective implements AfterViewInit, OnChanges {

  private _autofocus: any;

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit() {
    if (this._autofocus) {
      const el: HTMLInputElement = this.el.nativeElement;

      if (el.focus) {
        el.focus();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this._autofocus) {
      const el: HTMLInputElement = this.el.nativeElement;

      if (el.focus) {
        el.focus();
      }
    }
  }

  @Input() set autofocus(condition: any) {
    this._autofocus = condition !== false
      && condition !== null
      && condition !== undefined
      && condition !== 0
      && condition !== 'false'
      && condition !== 'null'
      && condition !== 'undefined'
      && condition !== '0'
    ;
  }
}
