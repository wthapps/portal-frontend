import { Injectable } from "@angular/core";
import { Communication } from "@shared/shared/helpers/communication/communication";
import { Subject, Observable } from "rxjs";

@Injectable()
export class SharingModalService {
  open: Subject<any> = new Subject<any>();
  onOpen$: Observable<any> = this.open.asObservable();

  add: Subject<any> = new Subject<any>();
  onAdd$: Observable<any> = this.add.asObservable();

  save: Subject<any> = new Subject<any>();
  onSave$: Observable<any> = this.save.asObservable();
}
