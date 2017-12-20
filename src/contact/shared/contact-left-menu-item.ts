import { BaseMenuItem } from '../../shared/shared/components/menu/base-menu-item';

export class ContactLeftMenuItem extends BaseMenuItem {
  count?: number;
  hasSubMenu?: boolean;
  menuItems?: BaseMenuItem[];

  constructor() {
    super();
  }
}
