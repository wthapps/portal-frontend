import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
//2 import { DomSanitizationService } from '@angular/platform-browser';
import { Product } from '../../shared/models/product.model';

import { MenuItem } from '../../partials/index';

import { ApiBaseService, UserService } from '../../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'app-detail.component.html'
})

export class AccountAppsDetailComponent implements OnInit {
  pageTitle: string = '';
  errorMessage: string;

  item: Product = new Product();
  descriptionContent: any = '';
  added: boolean = false;

  private app_id: number = 0;
  private breadcrumbs: MenuItem[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apiBaseService: ApiBaseService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.breadcrumbs = [];
    this.breadcrumbs.push({label: 'Library', url: '/account/apps'});

    this.route.params.forEach((params: Params) => {
      this.app_id = +params['id']; // (+) converts string 'id' to a number

      // verify this app_id is added or not
      this.apiBaseService.get(`users/${this.userService.profile.id}/apps/${this.app_id}/check_added`)
        .subscribe((response: any) => {
            this.added = response.added;
          },
          error => {
            this.errorMessage = <any>error;
          }
        );

      this.getProduct(this.app_id);
    });
  }

  getProduct(id: number) {
    this.apiBaseService.get(`apps/${id}`).subscribe(
      (res: any) => {
        this.item = res.data;
        this.descriptionContent = res.data.description;
        this.breadcrumbs.push({label: res.data.display_name});
      },
      error => this.errorMessage = <any>error
    );
  }


  add(event: any): void {
    event.preventDefault();
    this.apiBaseService.post(`users/${this.userService.profile.id}/apps/${this.app_id}`, '').subscribe(
      (response: any) => {
        //console.log(this.app_id, response);
        let data: any = JSON.parse(response._body);
        this.added = data.added;
      },
      error => this.errorMessage = <any>error
    );
  }

  manage(): void {
    this.router.navigate(['/account/my-apps/', this.app_id]);
  }
}
