import {Component} from '@angular/core';

@Component({
    selector: 'wth-app',
    template: `
    <h1 class="text-center">{{pageTitle}}</h1>
    `
})

export class AppComponent {
    pageTitle:string = "Welcome to WTHApps";
}