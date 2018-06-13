import { Injectable } from "@angular/core";
import { Mixin } from "@shared/design-patterns/decorator/mixin-decorator";
import { Communication } from "@shared/shared/helpers/communication/communication";

@Injectable()
export class PlaylistModalService extends Communication {
  open(data?: any) {
    this.send({ action: 'open', payload: data });
  }
}
