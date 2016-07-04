import {Component, EventEmitter, OnInit, OnDestroy, ViewEncapsulation} from "@angular/core";
import {Toast} from "./toast";
import {ToastsService} from "./toasts.service";
import {ToastComponent} from "./toast.component";


@Component({
  selector: "wth-toast",
  directives: [ToastComponent],
  inputs: ["options"],
  outputs: ["onCreate", "onDestroy"],
  encapsulation: ViewEncapsulation.None,
  template: `
        <div class="simple-toast-wrapper container">
            <simple-toast
                *ngFor="let a of toasts; let i = index"
                [item]="a"
                [timeOut]="timeOut"
                [clickToClose]="clickToClose"
                [maxLength]="maxLength"
                [showProgressBar]="showProgressBar"
                [pauseOnHover]="pauseOnHover"
                [theClass]="theClass"
                [rtl]="rtl"
                [position]="i">
            </simple-toast>
        </div>
    `
  /*, styles: [`
   .simple-toast-wrapper {
   position: fixed;
   bottom: 20px;
   right: 20px;
   width: 300px;
   z-index: 1000;
   }
   `]*/
})

export class SimpleToastsComponent implements OnInit, OnDestroy {
  constructor(private _service:ToastsService) {
  }


  public toasts:Toast[] = [];
  public options:any = {
    timeOut: 0,
    lastOnBottom: true
  };

  private listener:any;

  // Received values
  private lastOnBottom:boolean = true;
  private maxStack:number = 8;
  private preventLastDuplicates:any = false;
  private preventDuplicates:boolean = false;

  // Sent values
  private timeOut:number = 0;
  private maxLength:number = 0;
  private clickToClose:boolean = true;
  private showProgressBar:boolean = true;
  private pauseOnHover:boolean = true;
  private theClass:string;
  private rtl:boolean = false;
  private expand:string;

  private lastToastCreated:Toast;

  // Outputs
  private onCreate = new EventEmitter();
  private onDestroy = new EventEmitter();

  ngOnInit() {
    // Listen for changes in the service
    this.listener = this._service.getChangeEmitter()
      .subscribe(item => {


        switch (item.command) {
          case "cleanAll":
            this.toasts = [];
            break;

          case "clean":
            this.cleanSingle(item.id);
            break;

          case "set":
            if (item.add) this.add(item.toast);
            else this.defaultBehavior(item);
            break;

          default:
            this.defaultBehavior(item);
            break;
        }
      });

    this.attachChanges();
  }

  // Default behavior on event
  defaultBehavior(value) {
    this.toasts.splice(this.toasts.indexOf(value.toast), 1);
    this.onDestroy.emit(this.buildEmit(value.toast, false));
  }


  // Add the new toast to the toast array
  add(item) {
    item.createdOn = new Date();
    item.id = Math.random().toString(36).substring(3);

    let toBlock = this.preventLastDuplicates || this.preventDuplicates ? this.block(item) : false;

    // Save this as the last created toast
    this.lastToastCreated = item;

    if (!toBlock) {
      // Check if the toast should be added at the start or the end of the array
      if (this.lastOnBottom) {
        if (this.toasts.length >= this.maxStack) this.toasts.splice(0, 1);
        this.toasts.push(item);
      } else {
        if (this.toasts.length >= this.maxStack) this.toasts.splice(this.toasts.length - 1, 1);
        this.toasts.splice(0, 0, item);
      }

      this.onCreate.emit(this.buildEmit(item, true));
    }
  }

  // Check if toasts should be prevented
  block(item) {

    let toCheck = item.html ? checkHtml : checkStandard;

    if (this.preventDuplicates && this.toasts.length > 0)
      for (let i = 0; i < this.toasts.length; i++)
        if (toCheck(this.toasts[i])) return true;


    if (this.preventLastDuplicates) {

      let comp:any;

      if (this.preventLastDuplicates === "visible" && this.toasts.length > 0) {
        if (this.lastOnBottom) comp = this.toasts[this.toasts.length - 1];
        else comp = this.toasts[0];
      }

      else if (this.preventLastDuplicates === "all" && this.lastToastCreated) comp = this.lastToastCreated;
      else return false;
      return toCheck(comp);

    }

    return false;

    function checkHtml(checker) {
      return checker.html ? checker.type === item.type && checker.title === item.title && checker.content === item.content && checker.html === item.html : false;
    }

    function checkStandard(checker) {
      return checker.type === item.type && checker.title === item.title && checker.content === item.content;
    }
  }

  // Attach all the changes received in the options object
  attachChanges() {
    Object.keys(this.options).forEach(a => this[a] = this.options[a])
  }

  buildEmit(toast:Toast, to:boolean) {
    let toEmit = {
      createdOn: toast.createdOn,
      type: toast.type,
      id: toast.id
    };

    if (toast.html) toEmit["html"] = toast.html;

    else {
      toEmit["title"] = toast.title;
      toEmit["content"] = toast.content;
    }

    if (!to) toEmit["destroyedOn"] = new Date();

    return toEmit;
  }

  cleanSingle(id:string) {
    let indexOfDelete:number,
      doDelete:boolean = false;

    this.toasts.forEach((a, idx) => {
      if (a.id === id) {
        indexOfDelete = idx;
        doDelete = true;
      }
    });

    if (doDelete) this.toasts.splice(indexOfDelete, 1);
  }

  ngOnDestroy() {
    if (this.listener) this.listener.unsubscribe()
  }
}
