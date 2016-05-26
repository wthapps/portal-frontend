import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
    templateUrl: 'app/services/services.component.html',
    directives: [
        ROUTER_DIRECTIVES
    ]
})

export class ServicesComponent {
    pageTitle:string = "Services Page"
}