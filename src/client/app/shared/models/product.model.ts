import { Category } from './category.model';
import { Platform } from './platform.model';

export class Product {

  id: number;
  uuid: string;
  name: string;
  display_name: string;
  download_link: string;
  description: string;
  version: string;
  size: string;
  img_src: string;
  product_categories_id: number;
  is_featured: boolean;
  is_top: boolean;
  is_new: boolean;
  active: boolean;  
  category: Category;
  platforms: Array<Platform>;
  updated_at: string;
  

  constructor(fields?: {
    id?: number,
    uuid?: string,
    name?: string,
    display_name?: string,
    download_link?: string,
    description?: string,
    version?: string,
    size?: string,
    img_src?: string,
    product_categories_id?: number,
    is_featured?: boolean,
    is_top?: boolean,
    is_new?: boolean,
    active?: boolean,   
    category?: Category,
    platforms?: Array<Platform>,
    updated_at?: string
  }) {
    if (fields) Object.assign(this, fields);

    if (fields == undefined) {
      this.uuid = '';
      this.name = '';
      this.category = new Category();
    }     
  }
}