import { Injectable } from "@angular/core";
import { Communication } from "@shared/shared/helpers/communication/communication";
import { Subject, Observable } from "rxjs";

@Injectable()
export class PlaylistCreateModalService extends Communication {

  created: Subject<any> = new Subject<any>();
  onCreated$: Observable<any> = this.created.asObservable();

  open: Subject<any> = new Subject<any>();
  onOpen$: Observable<any> = this.open.asObservable();

//   this.send({action: 'open', payload: data})
//     open(data?: any) {
// }
}
