import { NgModule, Component, ElementRef, Renderer2 } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  ButtonModule, ConfirmationService, ConfirmDialog, DomHandler, Footer,
  SharedModule
} from 'primeng/primeng';

@Component({
  selector: 'h-confirmDialog',
  template: `
        <div [ngClass]="{'ui-dialog ui-confirmdialog ui-widget ui-widget-content ui-corner-all ui-shadow':true,'ui-dialog-rtl':rtl}" 
            [style.display]="visible ? 'block' : 'none'" [style.width.px]="width" [style.height.px]="height" (mousedown)="moveOnTop()" [@dialogState]="visible ? 'visible' : 'hidden'">
            <div class="ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top">
                <span class="ui-dialog-title" *ngIf="header">{{header}}</span>
                <a *ngIf="closable" [ngClass]="{'ui-dialog-titlebar-icon ui-dialog-titlebar-close ui-corner-all':true}" href="#" role="button" (click)="close($event)">
                    <span class="fa fa-fw fa-close"></span>
                </a>
            </div>
            <div class="ui-dialog-content ui-widget-content">
                <i [ngClass]="'fa'" [class]="icon"></i>
                <span class="ui-confirmdialog-message" [innerHTML]="message"></span>
            </div>
            <div class="ui-dialog-footer ui-widget-content" *ngIf="footer">              
                <ng-content select="p-footer"></ng-content>
            </div>
            <div class="ui-dialog-footer ui-widget-content" *ngIf="!footer">
                <button type="button" pButton [icon]="acceptIcon" [label]="acceptLabel" (click)="accept()" *ngIf="acceptVisible"></button>
                <button type="button" pButton [icon]="rejectIcon" [label]="rejectLabel" (click)="reject()" *ngIf="rejectVisible"></button>
            </div>
        </div>
    `,
  animations: [
    trigger('dialogState', [
      state('hidden', style({
        opacity: 0
      })),
      state('visible', style({
        opacity: 1
      })),
      transition('visible => hidden', animate('400ms ease-in')),
      transition('hidden => visible', animate('400ms ease-out'))
    ])
  ],
  providers: [DomHandler]
})
export class ConfirmDialogComponent extends ConfirmDialog {
  constructor(
    public el: ElementRef,
    public domHandler: DomHandler,
    public renderer: Renderer2,
    confirmationService: ConfirmationService) {
    super(el, domHandler, renderer, confirmationService);
    this.subscription = confirmationService.requireConfirmation$.subscribe((confirmation: any) => {
      if(confirmation.key === this.key) {
        this.acceptLabel = confirmation.acceptLabel || 'Done';
        this.rejectLabel = confirmation.rejectLabel || 'Cancel';
      }
    });
  }
}

@NgModule({
  imports: [CommonModule,ButtonModule],
  exports: [ConfirmDialogComponent,ButtonModule,SharedModule],
  declarations: [ConfirmDialogComponent]
})
export class ConfirmDialogModule { }
