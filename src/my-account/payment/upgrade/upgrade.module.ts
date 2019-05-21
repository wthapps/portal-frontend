import { NgModule } from '@angular/core';
import { MySharedModule } from '@account/shared/shared.module';
import { UpgradeComponent } from './upgrade.component';
import { UpgradeCompletionComponent } from './upgrade-completion.component';


@NgModule({
  imports: [
    MySharedModule
  ],
  declarations: [
    UpgradeComponent,
    UpgradeCompletionComponent
  ],
  exports: [
    UpgradeComponent,
    UpgradeCompletionComponent
  ]
})

export class UpgradeModule {}
