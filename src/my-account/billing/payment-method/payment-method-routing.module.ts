// import { NgModule } from '@angular/core';
// import { RouterModule } from '@angular/router';
//
// import { AuthGuard } from '@shared/services';
// import { PaymentMethodComponent } from './payment-method.component';
//
// @NgModule({
//   imports: [
//     RouterModule.forChild([
//       {
//         path: 'payment_method',
//         component: PaymentMethodComponent,
//         canActivate: [AuthGuard],
//         children: [
//           {path: 'add', component: PaymentMethodComponent},
//           {path: 'edit', component: PaymentMethodComponent},
//           {path: '', component: PaymentMethodComponent},
//           {path: '*', component: PaymentMethodComponent}
//         ]
//       }
//     ])
//   ],
//   exports: [RouterModule]
// })
// export class PaymentMethodRoutingModule {
// }
