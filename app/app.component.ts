import {Component} from '@angular/core';
import {HTTP_PROVIDERS, Http} from '@angular/http';
import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES, Routes, Router} from '@angular/router';
import 'rxjs/Rx';   // Load all features

import {HomeComponent} from './home/home.component';
import {ProductListComponent} from './products/product-list.component';

@Component({
    selector: 'wth-app',
    templateUrl: 'app/app.component.html',
    directives: [
        ROUTER_DIRECTIVES
    ],
    providers: [
        HTTP_PROVIDERS,
        ROUTER_PROVIDERS
    ]
})

@Routes([
    {path: '/', component: HomeComponent},
    {path: '/home', component: HomeComponent},
    {path: '/products', component: ProductListComponent}
])

export class AppComponent {
    pageTitle:string = "Welcome to WTHApps";
}