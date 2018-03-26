import { Observable } from "rxjs/Observable";

export class ApiCommand {

  static createRequest(method: string = 'get', path: string = '', body: any = {}, options: any = {}) {
    return Observable.create((observer: any) => {
      observer.next({method, path, body, options});
    })
  }
}
