export class Product {

  id: number;
  uuid: string;
  name: string;
  display_name: string;
  download_link: string;
  description: string;
  img_src: string;
  template_id: any;
  template_path: string;
  product_category_id: number;
  active: boolean;
  router_link: string;

  constructor(
    fields?: {
      id?: number,
      uuid?: string,
      name?: string,
      display_name?: string;
      download_link?: string;
      description?: string;
      img_src?: string;
      template_id?: any;
      template_path?: string;
      product_category_id?: number;
      active?: boolean;
      router_link?: string;
    }
  ){
    if (fields) Object.assign(this, fields);
  }

}
