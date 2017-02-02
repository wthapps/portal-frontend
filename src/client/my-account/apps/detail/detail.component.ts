import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Product } from '../../../core/shared/models/product.model';
import { MenuItemBreadcrumb } from '../../../core/partials/breadcrumb/breadcrumb';
import { UserService } from '../../../core/shared/services/user.service';

import { ACAppsService } from '../apps.service';

@Component({
  moduleId: module.id,
  selector: 'ac-apps-detail',
  templateUrl: 'detail.component.html'
})

export class ACAppsDetailComponent implements OnInit {
  pageTitle: string = '';
  errorMessage: string;

  item: Product = new Product();
  descriptionContent: any = '';
  added: boolean = false;

  private app_id: number = 0;
  private breadcrumbs: MenuItemBreadcrumb[];

  constructor(private route: ActivatedRoute,
              private appsService: ACAppsService,
              private router: Router,
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
