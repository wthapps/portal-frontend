import {Component, Input, OnChanges} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {Product} from '../../../shared/models/product.model';
import {AppCardService} from '../app-card.service';

/**
 * This class represents the AppCardSmComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'app-card-category',
  template: `
          <p class="cat">{{category}}</p>
  `,
  directives: [ROUTER_DIRECTIVES],
  viewProviders: [
    AppCardService
  ]
})
export class AppCardCategoryComponent implements OnChanges {
  @Input() data: Product;

  category: string = '';
  categoryId: number = 1;

  constructor(private appCardService: AppCardService) {
  }

  ngOnChanges(): void {
    if (this.data.product_categories_id) {
      this.appCardService.get(`products/categories/${this.data.product_categories_id}`).subscribe(
        (res: any) => {
          this.category = res.data.display_name;
        },
        error => console.log(<any>error)
      );
    }
  }
}
