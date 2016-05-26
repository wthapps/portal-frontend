import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
    templateUrl: 'app/apps/apps.component.html',
    directives: [
        ROUTER_DIRECTIVES
    ]
})

export class ApplicationsComponent {
    pageTitle:string = "Apps Page"
}