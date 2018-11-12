import { Subject } from 'rxjs';

export class Communication {
  protected eventOutSource = new Subject<any>();

  public events$: any = this.eventOutSource.asObservable();

  send(data: any) {
    this.eventOutSource.next(data);
  }
}
