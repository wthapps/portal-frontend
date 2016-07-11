export class ToastOptions {
  timeOut:number;
  lastOnBottom:boolean;
  clickToClose:boolean;

  constructor(timeOut?:number, lastOnBottom?:boolean, clickToClose?:boolean) {
    this.timeOut = timeOut || 0;
    this.lastOnBottom = lastOnBottom || false;
    this.clickToClose = clickToClose || true;
  }
}

export class Toast {
  message:string;
  option:ToastOptions[];
  type:string;
  id:number;

  constructor(message:string, option?:ToastOptions[], type?:string, id?:number) {
    this.message = message;
    this.option = option || [];
    this.type = type || 'danger';
    this.id = id || 0;
  }
}

