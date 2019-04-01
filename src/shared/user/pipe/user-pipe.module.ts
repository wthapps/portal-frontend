import { NgModule } from '@angular/core';
import { UserAddressPipe } from '@shared/user/pipe/user-address.pipe';

@NgModule({
  imports: [
  ],
  declarations: [
    UserAddressPipe,
  ],
  exports: [
    UserAddressPipe,
  ]
})
export class UserPipeModule {}
