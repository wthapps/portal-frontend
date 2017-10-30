import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import 'rxjs/add/operator/toPromise';

import { PhotoService } from '../../core/shared/services/photo.service';
import { LoadingService } from '../../core/shared/components/loading/loading.service';
import { BasePhotoDetailComponent } from '../../core/shared/components/photo/detail/base-photo-detail.component';
import { CommonEvent } from '../../core/shared/services/common-event/common-event';
import { CommonEventService } from '../../core/shared/services/common-event/common-event.service';
import { WthConfirmService } from '../../core/shared/components/confirmation/wth-confirm.service';

declare let _: any;
declare let $: any;

@Component({
  moduleId: module.id,
  selector: 'note-photo-detail',
  templateUrl: 'photo-detail.component.html'
})
export class NotePhotoDetailComponent extends BasePhotoDetailComponent implements OnInit {
  messageId: any;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected wthConfirmService: WthConfirmService,
    protected loadingService: LoadingService,
    protected commonEventService: CommonEventService,
    protected photoService: PhotoService
  ) {
    super(route, router, wthConfirmService, loadingService, photoService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.route.params.subscribe(
      (params: any) => {
        this.messageId = params.message;
      }
    );
  }

  doEvent(event: any) {
    switch(event.action) {
      // Handle all of event in child class here
      case 'update':
        super.doEvent(event);
        break;
      case 'goBack':
        this.router.navigate([{outlets: {modal: null}}]);
        break;
      case 'destroy':
        $("#modal-note-edit").css('z-index', '1050');
        $("#modal-note-edit").css('display', 'block');
        $(".modal-backdrop").css('z-index', '1040');
        break;
      default:
        super.doEvent(event);
        break;
    }
  }

  doAction(event: CommonEvent) {
    var editingEvent = _.cloneDeep(event); // this helps current value doesn't change when users edit message

    this.commonEventService.broadcast(editingEvent);
  }

  confirmUpdate(payload: any): Promise<any> {
    return super.confirmUpdate(payload)
      .then((res: any) => {
      this.doEvent({action: 'update', data: res});
    });
  }

  confirmDelete(payload: any): Promise<any> {
    return super.confirmDelete(payload)
      .then((res: any) => {
        console.log(res);
      });
  }
}
