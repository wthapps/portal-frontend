import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";

@Injectable()
export class PlaylistModalService {
  open: Subject<any> = new Subject<any>();
  onOpen$: Observable<any> = this.open.asObservable();

  add: Subject<any> = new Subject<any>();
  onAdd$: Observable<any> = this.add.asObservable();
}
