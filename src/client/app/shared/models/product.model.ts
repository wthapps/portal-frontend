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
  template_id: any;
  template_path: string;
  product_categories_id: number;
  active: boolean;
  router_link: string;
  platforms: any;
  updated_at: string;

  constructor(fields?: {
    id?: number,
    uuid?: string,
    name?: string,
    display_name?: string;
    download_link?: string;
    description?: string;
    version?: string;
    size?: string;
    img_src?: string;
    template_id?: any;
    template_path?: string;
    product_categories_id?: number;
    active?: boolean;
    router_link?: string;
    platforms?: any;
    updated_at?: string;
  }) {
    if (fields) Object.assign(this, fields);
  }
}


export class Platform {

  id: number;
  uuid: string;
  name: string;
  display_name: string;
  description: string;

  constructor(fields?: {
    id?: number,
    uuid?: string,
    name?: string,
    display_name?: string;
    description?: string;
  }) {
    if (fields) Object.assign(this, fields);
  }
}
