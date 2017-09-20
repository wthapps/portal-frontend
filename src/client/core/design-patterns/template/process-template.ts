//// How to use
// let createMessage: any = (event: any, next: any) => {
//   console.log(event)
//   next({step: 1, status: "create message done"});
// }
// let uploadFile: any = function(event: any, next: any) {
//   console.log(event)
//   next({step: 2, status: "upload file done"});
// }
// let updateMessage: any = function(event: any, next: any) {
//   console.log(event)
//   next({step: 3, status: "update message done"});
// }
// let done: any = function(event: any) {
//   console.log(event)
// }
// let uploadProcess: any = Process([createMessage, uploadFile, updateMessage, done]);
// uploadProcess.start();
// uploadProcess.stop();

export const Process = function (arr: any = []) {
  this.current = 0;
  this.list = [];
  // Overwrite it outside if you need
  // instance.done = (event) => { code here }
  for (let i = 0; i < arr.length; i++) {
    // Create method default
    let func = (event = {}, next = () => {}) => {
      if(typeof arr[i] === 'function') return arr[i](event, next)
    };
    this.list.push(func);
  }

  this.next = (event: any) => {
    this.current++;
    typeof this.list[this.current] === 'function' && this.list[this.current](event, this.next);
  };

  this.start = (event = {}, afterFunc = (event: any) => {}) => {
    typeof this.list[this.current] === 'function' && this.list[this.current](event, this.next);
    afterFunc(event);
  };

  this.stop = (afterFunc = (event: any) => {}) => {
    this.list.length = 0;
    afterFunc(event);
  };

  this.restart = (afterFunc = (event: any) => {}) => {
    afterFunc(event);
  };

  return this;
};
