import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { Response, Http } from '@angular/http';
import { ZContactThreeDotActionsService } from '../actions/three-dot-actions/contact-three-dot.service';
import { ZContactAddContactService } from '../modal/add-contact/add-contact.service';
import { BaseEntityService } from '../../../core/shared/services/base-entity-service';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';
import { Constants } from '../../../core/shared/config/constants';
import { ContactImportContactDataService } from '../modal/import-contact/import-contact-data.service';
import { ConfirmationService } from 'primeng/components/common/api';
import { ToastsService } from '../../../core/shared/components/toast/toast-message.service';

declare var _: any;

@Injectable()
export class ZContactMenuService extends BaseEntityService<any> {
  private contactMenuSubject: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);

  contactsMenu$: Observable<Array<any>> = this.contactMenuSubject.asObservable();

  constructor(protected apiBaseService: ApiBaseService,
              public importContactDataService: ContactImportContactDataService,
              public contactThreeDotActionsService: ZContactThreeDotActionsService,
              public contactAddContactService: ZContactAddContactService,
              private toastsService: ToastsService,
              private confirmationService: ConfirmationService) {
    super(apiBaseService);
  }

  addMenus(menus: any[]) {
    let curr_menu: any[] = this.contactMenuSubject.getValue();
    this.contactMenuSubject.next(curr_menu.concat(menus));
  }

  updateMenuName(newMenu: any) {
    let idx = _.find(this.contactMenuSubject.getValue(), (menu: any) => menu.id === newMenu.id);
    let updatedMenu = this.contactMenuSubject.getValue();
    _.set(updatedMenu, `${idx}.name`, newMenu.name);
    this.contactMenuSubject.next(updatedMenu);
  }

  // TODO: Scan all contacts and perform the label update
  updateLabelCount() {

  }

  deleteMenu(menu: any) {
    let updatedMenu = this.contactMenuSubject.getValue();
    _.remove(updatedMenu, (m: any) => m.id === menu.id);
    this.contactMenuSubject.next(updatedMenu);
  }
}
