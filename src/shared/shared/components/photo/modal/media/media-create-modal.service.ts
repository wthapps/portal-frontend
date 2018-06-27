import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";

@Injectable()
export class MediaCreateModalService {

  create: Subject<any> = new Subject<any>();
  onCreate$: Observable<any> = this.create.asObservable();

  open: Subject<any> = new Subject<any>();
  onOpen$: Observable<any> = this.open.asObservable();
}
