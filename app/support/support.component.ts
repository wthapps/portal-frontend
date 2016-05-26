import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
    templateUrl: 'app/support/support.component.html',
    directives: [
        ROUTER_DIRECTIVES
    ]
})

export class SupportComponent {
    pageTitle:string = "Support Page"
}