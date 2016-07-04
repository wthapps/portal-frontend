import {Component, OnInit, OnDestroy, ViewEncapsulation} from "@angular/core";
import {Toast} from "./toast";
import {ToastsService} from "./toasts.service";
import {MaxPipe} from "./max.pipe";
import {Icons} from "./icons";

@Component({
  selector: "simple-toast",

  inputs: [
    "item",
    "timeOut",
    "position",
    "clickToClose",
    "maxLength",
    "showProgressBar",
    "pauseOnHover",
    "theClass",
    "rtl"
  ],
  pipes: [MaxPipe],
  encapsulation: ViewEncapsulation.None,
  template: `
      <div class="simple-toast alert"
          [class]="theClass"
          
          [ngClass]="{
              'alert-warning': item.type === 'warning', 
              'alert-danger': item.type === 'danger', 
              'alert-success': item.type === 'success', 
              'alert-info': item.type === 'info',
              'bare': item.type === 'bare',
              'rtl-mode': rtl
          }"
              
          (mouseenter)="onEnter()"
          (mouseleave)="onLeave()">
          <button type="button" class="close" (click)="removeSelf()"><span aria-hidden="true">&times;</span></button>
          <div *ngIf="!item.html">
              <div class="content">{{item.content | max:maxLength}}</div>
          </div>
          <div *ngIf="item.html" [innerHTML]="item.html"></div>

          <div class="progress-loader" *ngIf="showProgressBar">
              <span [ngStyle]="{'width': progressWidth + '%'}"></span>
          </div>
      </div>
    `,
  styles: [`
        .simple-toast {
            position: relative;
            transition: all 0.5s;
        }

        .simple-toast .content {
            margin: 0;
            font-size: 16px;
            padding: 0 50px 0 0;
            line-height: 20px;
        }

        .simple-toast svg {
            position: absolute;
            box-sizing: border-box;
            top: 0;
            right: 0;
            width: auto;
            height: 70px;
            padding: 10px;
            fill: #fff;
        }
        
        .simple-toast.rtl-mode {
            direction: rtl;
        }
        
        .simple-toast.rtl-mode .content {
            padding: 0 0 0 50px;
        }
        
        .simple-toast.rtl-mode svg {
            left: 0;
            right: auto;
        }

        /*.simple-toast.error { background: #F44336; }
        .simple-toast.success { background: #8BC34A; }
        .simple-toast.alert { background: #ffdb5b; }
        .simple-toast.info { background: #03A9F4; }*/

        .simple-toast .progress-loader {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 5px;
        }

        .simple-toast .progress-loader span {
            float: left;
            height: 100%;
        }

        .simple-toast.alert-success .progress-loader span { background: #689F38; }
        .simple-toast.alert-danger .progress-loader span { background: #e0b5b5; }
        .simple-toast.alert-warning .progress-loader span { background: #edc242; }
        .simple-toast.alert-info .progress-loader span { background: #0288D1; }
        .simple-toast.bare .progress-loader span { background: #ccc; }
    `]
})

export class ToastComponent implements OnInit, OnDestroy {
  constructor(private _service:ToastsService) {
  }

  public icons:any = Icons;

  ////// Inputs
  public item:Toast;
  public maxLength:number;
  public showProgressBar:boolean;
  public theClass:string;
  public theHtml:any;
  public rtl:boolean;

  public overrides:any;

  ////// Locals

  // Progress bar variables
  public progressWidth:number = 0;
  private stopTime:boolean = false;
  private timer:any;
  private steps:number;
  private speed:number;
  private count:number = 0;
  private start:any;
  private diff:any;

  private timeOut:number;
  private position:number;
  private clickToClose:boolean;
  private pauseOnHover:boolean;

  ngOnInit() {
    if (this.item.override) this.attachOverrides();
    if (this.timeOut !== 0) this.startTimeOut();
  }

  startTimeOut() {
    this.steps = this.timeOut / 10;
    this.speed = this.timeOut / this.steps;
    this.start = new Date().getTime();
    this.timer = setTimeout(this.instance, this.speed);
  }

  onEnter() {
    if (this.pauseOnHover) this.stopTime = true
  }

  onLeave() {
    if (this.pauseOnHover) {
      this.stopTime = false;
      setTimeout(this.instance, (this.speed - this.diff));
    }
  }

  setPosition() {
    return this.position !== 0 ? this.position * 90 : 0;
  }

  removeSelf() {
    if (this.clickToClose) this._service.set(this.item, false);
  }


  // Attach all the overrides
  attachOverrides() {
    Object.keys(this.item.override).forEach(a => this[a] = this.item.override[a])
  }

  ngOnDestroy() {
    clearTimeout(this.timer)
  }

  private instance = () => {
    this.diff = (new Date().getTime() - this.start) - (this.count * this.speed);
    if (this.count++ === this.steps) this._service.set(this.item, false);
    else if (!this.stopTime) {
      if (this.showProgressBar) this.progressWidth += 100 / this.steps;
      this.timer = setTimeout(this.instance, (this.speed - this.diff));
    }
  };
}
