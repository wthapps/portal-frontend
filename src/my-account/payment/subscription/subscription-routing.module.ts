// import { NgModule } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { AuthGuard } from '@wth/shared/services';
// import { CurrentSubscriptionComponent } from './current-subscription.component';
// import { SubscriptionUpgradeComponent } from './subscription-upgrade.component';
// import { SubscriptionAlertComponent } from './subscription-alert.component';
//
// @NgModule({
//   imports: [
//     RouterModule.forChild([
//       {
//         path: '',
//         component: CurrentSubscriptionComponent,
//         canActivate: [AuthGuard],
//         children: [
//           {
//             path: 'upgrade',
//             component: SubscriptionUpgradeComponent,
//             canActivate: [AuthGuard]
//           },
//           {
//             path: 'alert',
//             component: SubscriptionAlertComponent,
//             canActivate: [AuthGuard]
//           },
//         ]
//       }
//     ])
//   ],
//   exports: [RouterModule]
// })
// export class SubscriptionRoutingModule {}
