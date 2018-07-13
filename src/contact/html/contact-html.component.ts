import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact-html',
  templateUrl: 'contact-html.component.html',
  styleUrls: ['contact-html.component.scss']
})
export class ContactHtmlComponent implements OnInit, AfterViewInit {
  private fragment: string;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      this.fragment = fragment;
    });
  }

  ngAfterViewInit(): void {
    try {
      document.querySelector('#' + this.fragment).scrollIntoView();
    } catch (e) {
    }
  }
}
