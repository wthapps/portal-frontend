import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Label } from '../../label/label.model';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { Response, Http } from '@angular/http';
import { ZContactAddContactService } from '../modal/add-contact/add-contact.service';
import { BaseEntityService } from '../../../core/shared/services/base-entity-service';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';
import { Constants } from '../../../core/shared/config/constants';
import { ContactImportContactDataService } from '../modal/import-contact/import-contact-data.service';
import { ConfirmationService } from 'primeng/components/common/api';
import { ToastsService } from '../../../core/shared/components/toast/toast-message.service';

declare var _: any;

@Injectable()
export class ZContactMenuService {
  private contactMenuSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  contactMenu$: Observable<any[]> = this.contactMenuSubject.asObservable();

  constructor() {
  }


  updateLabelCount(contacts: any[]) {
    let menus: any = {};
    for(let ci = 0; ci < contacts.length; ci++) {
      _.each(contacts[ci].labels, (l: any) => {
        if(menus[`${l.name}`]) {
          menus[`${l.name}`].count += 1;
        } else {
          menus[`${l.name}`] = l;
          menus[`${l.name}`].count = 1;
        }
      });
    }

    // Update label count
    let cMenus = _.map(this.contactMenuSubject.getValue(), (m: any) => {
      if(menus[m.name])
        return Object.assign(m, {count: menus[m.name].count});
      if(m.name === 'all contact')
        return Object.assign(m, {count: contacts.length});
      else
        return m;

    });

    console.debug('After updateLabelCount: ', contacts.length, menus, _.values(menus));
    this.notifyCMObservers(cMenus);
  }


  setContactMenu(menus: any[]) {
    this.notifyCMObservers(menus);
  }

  addLabel(label: Label) {
    this.addMenu(this.mapLabelToMenuItem(label));
  }

  addLabels(labels: Label[]) {
    let menus: any[] = this.contactMenuSubject.getValue();
    _.each(labels, (label: Label) => {
      // let menus: any[] = this.contactMenuSubject.getValue();
      // menus.push(menu);

      menus.push(this.mapLabelToMenuItem(label));
    });

    // this.notifyCMObservers(menus);
  }

  addMenu(menu: any) {
    let menus: any[] = this.contactMenuSubject.getValue();
    menus.push(menu);
    console.debug('inside addMenu: ', menus);
    this.notifyCMObservers(menus);
  }

  removeMenu(menu: any) {
    let menus: any[] = this.contactMenuSubject.getValue();
    _.remove(menus, (m: any) => m.id === menu.id);
    this.notifyCMObservers(menus);
  }

  removeMenuByName(menu: any) {
    let menus: any[] = this.contactMenuSubject.getValue();
    _.remove(menus, (m: any) => m.name === menu.name);
    this.notifyCMObservers(menus);
  }

  updateMenu(menu: any) {
    let menus: any[] = _.map(this.contactMenuSubject.getValue(), (m: any) => {
      if(m.id === menu.id)
        return Object.assign(m, menu);
      else
        return m;
    });

    this.notifyCMObservers(menus);
  }

  updateNames(newMenu: any) {
    let menus: any[] = this.contactMenuSubject.getValue();
    _.each(menus, (menu: Label) => {
      if (newMenu.id == menu.id) {
        menu.name = newMenu.name;
        return;
      }
    });
  }

  private mapLabelToMenuItem(label: Label): any {
    return {
      id: label.id,
      name: label.name,
      link: '/contacts',
      hasSubMenu: !label.system,
      count: label.contact_count,
      icon: label.name == 'all contact' ? 'fa fa-address-book-o'
        : label.name == 'favourite' ? 'fa fa-star'
          : label.name == 'labels' ? 'fa fa-tags'
            : label.name == 'blacklist' ? 'fa fa-ban'
              : label.name == 'social' ? 'fa fa-globe'
                : label.name == 'chat' ? 'fa fa-comments-o'
                  : 'fa fa-folder-o'
    };
  }

  notifyCMObservers(menus: any[] = this.contactMenuSubject.getValue()) {
    this.contactMenuSubject.next(menus);
  }
}
