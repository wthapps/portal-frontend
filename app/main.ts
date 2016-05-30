/*import { bootstrap }    from '@angular/platform-browser-dynamic';

// Our main component
import { AppComponent } from './app.component';

bootstrap(AppComponent);*/



import { bootstrap } from '@angular/platform-browser-dynamic';
import { provide } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { ROUTER_PROVIDERS } from '@angular/router';

import { AppComponent } from './app.component';

/*import {enableProdMode} from '@angular/core';
enableProdMode();*/

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    provide(APP_BASE_HREF, { useValue: '/' }) // this line
]);