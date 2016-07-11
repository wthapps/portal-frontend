export class ToastOptions {
  timeOut:number;
  lastOnBottom:boolean;
  clickToClose:boolean;
}

export class Toast {
  message:string;
  option:ToastOptions;
  type:string;
  id:number;
}

