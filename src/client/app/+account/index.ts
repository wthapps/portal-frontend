/**
 * This barrel file provides the export for the lazy loaded AccountComponent.
 */
export * from './+recovery/forgotten-password.component';
export * from './+recovery/new-password.component';
export * from './+recovery/reset-email-sent.component';


/**
 * This barrel file provides the export for the lazy loaded AccountAppsComponent.
 */
export * from './+apps/index';

/**
* My Apps
*/
export * from './+my-apps/index';

/**
 *  Setting
 */
export * from './+setting/dashboard.component';
export * from './+setting/change-password.component';
export * from './+setting/my-account.component';
export * from './+setting/installed-apps.component';

/**
 *  Menu
 */
export * from './+menu/account-menu.component';
export * from './+menu/account-menu.viewmodel';

/**
 *  Payment
 */
export * from './+payment/payment.component';
export * from './+payment/payment-edit.component';
export * from './+payment/payment-confirm.component';

export * from './plans.component';
export * from './plan-details.component';
export * from './billing-details.component';
export * from './billing-history.component';
export * from './+billing/receipt.component';
export * from './+billing/transaction-details.component';

/**
 *  Services
*/
export * from './+services/services.component';
export * from './+services/services.service';
export * from './+services/content-presenter.component';

/**
 *  Services DNS
 */
export * from './+services/+dns/dns-add.component';
export * from './+services/+dns/dns-update.component';
export * from './+services/+dns/dns.component';
export * from './+services/+dns/dns.service';

/**
 *  Services VPN
 */
export * from './+services/+vpn/vpn.component';

/**
 *  Services eFax
 */
export * from './+services/+efax/efax.component';

/*
 * Always put them at the bottom
 */
export * from './account.component';
export * from './account.routes';
