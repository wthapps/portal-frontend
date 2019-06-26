import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SampleSharedModule } from './shared/shared.module';
import { SharedServicesModule } from '@shared/shared-services.module';

@NgModule({
  imports: [
    SampleSharedModule,
    AppRoutingModule,

    SharedServicesModule.forRoot(),
  ],
  declarations: [
    AppComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
