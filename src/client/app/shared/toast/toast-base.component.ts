declare var $: any;

export abstract class ToastBase {
  toastId: string;
  isShow: boolean;

  constructor(toastId: string) {
    this.toastId = toastId;
  }

  close() {
    this.isShow = false;
  }

  show() {
    this.isShow = true;
  }

  hide() {
    this.isShow = false;
  }
}
