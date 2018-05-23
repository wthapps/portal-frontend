import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';
import { environment } from '../environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => {
    console.log('should register SW');
    if ('serviceWorker' in navigator && environment.production) {
      navigator.serviceWorker.register('/ngsw-worker.js');
      console.log('register sw-worker. YAY');
    }
  })
  .catch(err => console.log(err));
