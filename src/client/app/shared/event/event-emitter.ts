import {Subject}                  from 'rxjs/Subject';
import {
  DefaultEventArgs,
  UserProductEventArgs
}                                 from './event-emitter-args';
//@TODO: will come up with base class
export class DefaultEventEmitter extends Subject<DefaultEventArgs> {
  constructor() {
    super();
  }

  send(value:DefaultEventArgs):void {
    super.next(value);
  }
}
export class UserProductEventEmitter extends Subject<UserProductEventArgs> {
  constructor() {
    super();
  }

  send(value:UserProductEventArgs):void {
    super.next(value);
  }
}
