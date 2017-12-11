import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MyAppsService } from '../apps.service';

import { Product } from '@wth/shared/shared/models/product.model';
import { UserService } from '@wth/shared/shared/services/user.service';
import { MenuItemBreadcrumb } from '@wth/shared/shared/components/breadcrumb/breadcrumb';

@Component({
  moduleId: module.id,
  selector: 'my-apps-detail',
  templateUrl: 'detail.component.html'
})

export class MyAppsDetailComponent implements OnInit {
  pageTitle: string = '';
  errorMessage: string;

  item: Product = new Product();
  descriptionContent: any = '';
  added: boolean = false;

  breadcrumbs: MenuItemBreadcrumb[];

  private app_id: number = 0;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private appsService: MyAppsService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.breadcrumbs = [];
    this.breadcrumbs.push({label: 'Library', url: '/apps'});

    this.route.params.forEach((params: Params) => {
      this.app_id = +params['id']; // (+) converts string 'id' to a number

      // verify this app_id is added or not
      this.appsService.checkAdded(this.app_id, this.userService.profile.id).subscribe(
        (response: any) => {
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
    this.appsService.detail(id).subscribe(
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
    this.appsService.add(this.app_id, this.userService.profile.id).subscribe(
      (response: any) => {
        //console.log(this.app_id, response);
        let data: any = response.data;
        this.added = data.added;
      },
      error => this.errorMessage = <any>error
    );
  }

  manage(): void {
    this.router.navigate(['/my-apps/', this.app_id]);
  }
}
