import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../shared/models/product.model';

import { MenuItem } from '../../partials/index';
import { ApiBaseService, UserService } from '../../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'my-apps-detail-add.component.html'
})

export class MyAppsDetailAddComponent implements OnInit, OnDestroy {
  pageTitle: string = '';
  errorMessage: string;

  item: Product = new Product();
  added: boolean = false;

  type: string = '';

  private app_id: number = 0;
  private sub: any;
  private breadcrumbs: MenuItem[];

  constructor(private route: ActivatedRoute,
              private appService: ApiBaseService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.breadcrumbs = [];
    this.breadcrumbs.push({label: 'App List', url: '/account/my-apps'});

    this.sub = this.route.params.subscribe(
      params => {
        this.app_id = +params['id'];

        // verify this app_id is added or not
        this.appService.get(`users/${this.userService.profile.id}/apps/${this.app_id}/check_added`)
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getProduct(id: number) {
    this.appService.get(`apps/${id}`).subscribe(
      (res: any) => {
        this.item = res.data;
        this.type = res.data.name.toLowerCase();
        this.breadcrumbs.push({label: res.data.display_name});
      },
      error => this.errorMessage = <any>error
    );
  }

}
