import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCardPlatformComponent } from './platform/app-card-platform.component';
import { AppCardComponent } from './app-card.component';


@NgModule({
  imports: [CommonModule],
  declarations: [
    AppCardComponent,
    AppCardPlatformComponent
  ],
  exports: [AppCardComponent]
})
export class AppCardModule {
}
