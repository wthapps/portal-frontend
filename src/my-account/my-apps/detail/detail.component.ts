import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Product } from '@wth/shared/shared/models/product.model';
import { MenuItemBreadcrumb } from '@wth/shared/shared/components/breadcrumb/breadcrumb';
import { UserService } from '@wth/shared/shared/services/user.service';
import { MyMyAppsService } from '../my-apps.service';

@Component({
  moduleId: module.id,
  selector: 'my-my-apps-detail',
  templateUrl: 'detail.component.html'
})

export class MyMyAppsDetailComponent implements OnInit, OnDestroy {
  pageTitle: string = '';
  errorMessage: string;

  item: Product = new Product();
  added: boolean = false;

  type: string = '';

  breadcrumbs: MenuItemBreadcrumb[];

  private app_id: number = 0;
  private sub: any;

  constructor(private route: ActivatedRoute,
              private myAppsService: MyMyAppsService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.breadcrumbs = [];
    this.breadcrumbs.push({label: 'App List', url: '/my-apps'});

    this.sub = this.route.params.subscribe(
      params => {
        this.app_id = +params['id'];

        // verify this app_id is added or not
        this.myAppsService.checkAdded(this.app_id, this.userService.profile.id).subscribe(
          (response: any) => {
            this.added = response.added;
          },
          (error: any) => {
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
    this.myAppsService.get(id).subscribe(
      (res: any) => {
        this.item = res.data;
        this.type = res.data.name.toLowerCase();
        console.log(this.type);
        this.breadcrumbs.push({label: res.data.display_name});
      },
      error => this.errorMessage = <any>error
    );
  }

}
