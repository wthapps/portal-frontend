import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { AuthService } from '@shared/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(private authService: AuthService) {

  }
}
