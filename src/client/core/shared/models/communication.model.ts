import { Subject } from 'rxjs';

export class Communication {
  protected eventOutSource = new Subject<any>();
  protected eventInSource = new Subject<any>();

  public eventOut: any = this.eventOutSource.asObservable();
  public eventIn: any = this.eventInSource.asObservable();

  sendOut(data: any) {
    this.eventOutSource.next(data);
  }

  recieve(data: any) {
    this.eventIn.next(data);
  }
}
