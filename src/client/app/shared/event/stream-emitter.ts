import {
  DefaultEventEmitter,
  UserProductEventEmitter
}                        from './event-emitter';
export class StreamEmitter {
  public Default:DefaultEventEmitter;
  public UserProducts:UserProductEventEmitter;
  constructor() {
    this.Default = new DefaultEventEmitter();
    this.UserProducts = new UserProductEventEmitter();
  }
}
