/**
 * This barrel file provides the export for the lazy loaded AccountComponent.
 */
export * from './recovery/forgotten-password.component';
export * from './recovery/new-password.component';
export * from './recovery/reset-email-sent.component';

/**
 *  Menu
 */
export * from './menu/account-menu.component';

/**
 *  Setting
 */
export * from './setting/profile.component';
export * from './setting/my-account.component';
export * from './setting/preferences.component';

/**
 * This barrel file provides the export for the lazy loaded AccountAppsComponent.
 */
export * from './apps/index';

/**
 * My Apps
 */
export * from './my-apps/index';

/**
 *  Payment
 */
export * from './payment/payment.component';
export * from './payment/payment-edit.component';
export * from './payment/payment-confirm.component';

export * from './plans.component';
export * from './billing/billing-details.component';
export * from './billing/billing-history.component';
export * from './billing/receipt.component';
export * from './billing/transaction-details.component';

/*
 * Always put them at the bottom
 */
export * from './account.component';
export * from './account.routes';
