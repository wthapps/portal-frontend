import { BaseMenuItem } from '../../core/shared/components/zone/menu/base-menu-item';

export class ContactLeftMenuItem extends BaseMenuItem {
  constructor() {
    super();
  }

  count?: number;
  hasSubMenu?: boolean;
  menuItems?: BaseMenuItem[];
}
