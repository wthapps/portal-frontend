import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ApiBaseService } from '../../core/shared/services/apibase.service';
import { Label } from './label.model';
import { BaseEntityService } from '../../core/shared/services/base-entity-service';

declare let _: any;
@Injectable()
export class LabelService extends BaseEntityService<Label> {
  private labelsSubject: BehaviorSubject<Label[]> = new BehaviorSubject<Label[]>([]);

  labels$: Observable<Label[]>;

  constructor(protected apiBaseService: ApiBaseService) {
    super(apiBaseService);
    this.url = 'contact/labels';

    this.labels$ = this.labelsSubject.asObservable();
  }

  getAllLabels(): Promise<Label[]> {
    console.debug('getAllLabels: ',this.labelsSubject.getValue());
    if(_.isEmpty(this.labelsSubject.getValue())) {

      return this.getAll().toPromise()
        .then((res: any) => {
        let labels: Label[] = _.map(res.data, (l: any) => this.mapLabelToMenuItem(l));
        return this.notifyLabelObservers(labels);
      });
    }

    return this.notifyLabelObservers();
  }

  create(body: any): Observable<any> {
    return super.create(body)
      .mergeMap((res: any) => {
        let label: any = this.mapLabelToMenuItem(res.data);
        return this.notifyLabelObservers(this.labelsSubject.getValue().concat([label]));
      });
  }


  update(body: any): Observable<any> {
    return super.update(body)
      .mergeMap((res: any) => this.updateMenu(this.mapLabelToMenuItem(res.data)));
  }

  delete(id: any): Observable<any> {
    return super.delete(id)
      .mergeMap((res: any) => this.removeMenu(res.data));
  }

  getLabelByName(name: string) {
    return _.find(this.labelsSubject.getValue(), (l: any) => l.name === name);
  }

  updateLabelCount(contacts: any[]) {
    let menus: any = {};
    for(let ci = 0; ci < contacts.length; ci++) {
      _.each(contacts[ci].labels, (l: any) => {
        if(!l)
          return;
        if(menus[`${l.name}`]) {
          menus[`${l.name}`].count += 1;
        } else {
          menus[`${l.name}`] = l;
          menus[`${l.name}`].count = 1;
        }
      });
    }

    // Update label count
    let cMenus = _.map(this.labelsSubject.getValue(), (m: any) => {
      if(menus[m.name])
        return Object.assign(m, {count: menus[m.name].count});
      if(m.name === 'all contacts')
        return Object.assign(m, {count: contacts.length});
      else
        return m;

    });

    this.notifyLabelObservers(cMenus);
  }

  setContactMenu(menus: any[]) {
    this.notifyLabelObservers(menus);
  }

  addLabel(label: Label) {
    this.addMenu(this.mapLabelToMenuItem(label));
  }

  addLabels(labels: Label[]) {
    let menus: any[] = this.labelsSubject.getValue();
    _.each(labels, (label: Label) => {
      // let menus: any[] = this.contactMenuSubject.getValue();
      // menus.push(menu);

      menus.push(this.mapLabelToMenuItem(label));
    });

    // this.notifyLabelObservers(menus);
  }

  addMenu(menu: any): Promise<any> {
    let menus: any[] = this.labelsSubject.getValue();
    menus.push(menu);
    console.debug('inside addMenu: ', menus);
    return this.notifyLabelObservers(menus);
  }

  removeMenu(menu: any): Promise<any> {
    let menus: any[] = this.labelsSubject.getValue();
    _.remove(menus, (m: any) => m.id === menu.id);
    return this.notifyLabelObservers(menus);
  }

  removeMenuByName(menu: any): Promise<any> {
    let menus: any[] = this.labelsSubject.getValue();
    _.remove(menus, (m: any) => m.name === menu.name);
    return this.notifyLabelObservers(menus);
  }

  updateMenu(menu: any): Promise<any> {
    let menus: any[] = _.map(this.labelsSubject.getValue(), (m: any) => {
      if(m.id === menu.id)
        return Object.assign(m, menu);
      else
        return m;
    });

    return this.notifyLabelObservers(menus);
  }

  updateMenuName(menu: any): Promise<any> {
    let labels = this.labelsSubject.getValue();
    for(let i = 0; i < labels.length; i++) {
      if (menu.id == labels[i]['id']) {
        labels[i]['name'] = menu.name;
        break;
      }
    }
    return this.notifyLabelObservers(labels);
  }

  private mapLabelToMenuItem(label: Label): any {
    return {
      id: label.id,
      name: label.name,
      link: '/contacts',
      hasSubMenu: !label.system,
      count: label.contact_count,
      order: label.system ? label.order : (100 + label.order),
      icon: label.name == 'all contacts' ? 'fa fa-address-book-o'
        : label.name == 'favourite' ? 'fa fa-star'
          : label.name == 'labels' ? 'fa fa-tags'
            : label.name == 'blacklist' ? 'fa fa-ban'
              : label.name == 'social' ? 'fa fa-globe'
                : label.name == 'chat' ? 'fa fa-comments-o'
                  : 'fa fa-folder-o'
    };
  }

  notifyLabelObservers(labels: Label[] = this.labelsSubject.getValue()): Promise<any[]> {
    let orderedLabels = _.orderBy(labels, ['order'], ['asc']);
    this.labelsSubject.next(orderedLabels);

    console.debug('notifyLabelObservers: ', orderedLabels);
    return Promise.resolve(this.labelsSubject.getValue());
  }

  filterLabel(query: string, labels: any[]) {
    let filtered: any[] = [];
    for (let i = 0; i < labels.length; i++) {
      let label = labels[i];
      if (label.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(label.name);
      }
    }
    return filtered;
  }
}
