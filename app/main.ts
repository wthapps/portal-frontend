// This region will import global libraries on app

import { bootstrap } 		from '@angular/platform-browser-dynamic';
import { provide } 			from '@angular/core';
import { APP_BASE_HREF } 	from '@angular/common';
import { ROUTER_PROVIDERS } from '@angular/router';
import { Http }             from '@angular/http';
import { AppComponent } 	from './app.component';
import { AuthConfig, AuthHttp } from 'angular2-jwt';


/*import {enableProdMode} from '@angular/core';
enableProdMode();*/

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    // HTTP_PROVIDERS,
    // AUTH_PROVIDERS,
    provide(APP_BASE_HREF, { useValue: '/' }), // this line
    provide(AuthHttp, {
        useFactory: (http) => {
            return new AuthHttp(new AuthConfig({
                // headerName: 'Authorization', //YOUR_HEADER_NAME,
                // headerPrefix: 'Bearer', //YOUR_HEADER_PREFIX,
                tokenName: 'jwt',       // YOUR_TOKEN_NAME,
                // tokenGetter: YOUR_TOKEN_GETTER_FUNCTION,
                // globalHeaders: [{'Content-Type':'application/json'}],
                // noJwtError: true,
                // noTokenScheme: true
                }), http);
        },
        deps: [Http]
      })
]);