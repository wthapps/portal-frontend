import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';
import { environment } from '../environments/environment';
import { registerSw } from '@contacts/register-sw';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  // .then(() => {
  //   console.log('should register SW');
  //   if ('serviceWorker' in navigator && environment.production) {
  //     registerSw();
  //   }
  // })
  .catch(err => console.log(err));
