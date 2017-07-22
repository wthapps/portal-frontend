import { BaseMenuItem } from '../../core/partials/zone/menu/base-menu-item';
export class ContactLeftMenuItem extends BaseMenuItem {
  constructor(){
    super();
  }
  count?: number;
  hasSubMenu?: boolean;
  menuItems?: BaseMenuItem[];
}
