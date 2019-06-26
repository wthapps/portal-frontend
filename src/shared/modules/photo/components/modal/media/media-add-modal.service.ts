import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";

@Injectable()
export class MediaAddModalService {
  open: Subject<any> = new Subject<any>();
  onOpen$: Observable<any> = this.open.asObservable();

  openCreateNew: Subject<any> = new Subject<any>();
  onOpenCreateNew$: Observable<any> = this.openCreateNew.asObservable();

  add: Subject<any> = new Subject<any>();
  onAdd$: Observable<any> = this.add.asObservable();
}
