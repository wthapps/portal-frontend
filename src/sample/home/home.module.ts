import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { CommonModule } from '@angular/common';
import { CookieModule } from 'ngx-cookie';
import { FormsModule } from '@angular/forms';
import { WDataViewModule } from '../shared/components/w-dataView/w-dataView.module';
import { LocalStorageModule } from 'angular-2-local-storage';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';
import { WthConfirmModule } from '@shared/shared/components/confirmation/wth-confirm.module';
import { DirectiveModule } from '@shared/shared/directive/directive.module';
import { ToastModule } from 'primeng/toast';
import { WModalsModule } from '../shared/components/modals/modals.module';

@NgModule({
  imports: [
    CommonModule,
    CookieModule.forRoot(),
    FormsModule,
    HomeRoutingModule,
    WDataViewModule,
    LocalStorageModule.withConfig({
      prefix: 'my-app',
      storageType: 'localStorage'
    }),
    BoxNoDataModule,
    BoxLoadingModule,
    WthConfirmModule,
    DirectiveModule,
    ToastModule,
    WModalsModule
  ],
  declarations: [HomeComponent],
  exports: [HomeComponent],
  providers: []
})
export class HomeModule {
}
