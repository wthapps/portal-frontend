import { NgModule } from '@angular/core';
import { MySharedModule } from '@account/shared/shared.module';
import { UpgradeCompletionComponent } from './upgrade-completion.component';


@NgModule({
  imports: [
    MySharedModule
  ],
  declarations: [
    UpgradeCompletionComponent
  ],
  exports: [
    UpgradeCompletionComponent
  ]
})

export class UpgradeModule {}
