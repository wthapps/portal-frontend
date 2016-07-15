export class Category {
  uuid:string;
  id:number;
  name:string;
  display_name:string;
  description:string;

  constructor(uuid:string = '',
              id:number = 0,
              name:string = '',
              display_name:string = '',
              description:string = '') {
    this.uuid = uuid;
    this.id = id;
    this.name = name;
    this.display_name = display_name;
    this.description = description;
  };
}
export class Action {
  id:number;
  name:string;
  router:string;
  disabled:boolean;

  constructor(id:any = 0,
              name:any = '',
              router:any = '',
              disabled:any = false) {
    this.id = id;
    this.name = name;
    this.router = router;
    this.disabled = disabled;
  }
}
export class AddonService {

  id:number;
  uuid:string;
  name:string;
  display_name:string;
  download_link:string;
  description:string;
  img_src:string;
  template_id:string;
  template_path:string;
  created:boolean;
  active:boolean;
  product_categories_id:number;
  router_link:string;

  constructor(id:number = 0,
              uuid:string = '',
              name:string = '',
              display_name:string = '',
              download_link:string = '',
              description:string = '',
              img_src:string = '',
              template_id:string = '',
              template_path:string = '',
              created:boolean = false,
              active:boolean = false,
              product_categories_id:number = 0,
              router_link:string = '') {
    this.id = id;
    this.uuid = uuid;
    this.name = name;
    this.display_name = display_name;
    this.download_link = download_link;
    this.description = description;
    this.img_src = img_src;
    this.template_id = template_id;
    this.template_path = template_path;
    this.created = created;
    this.active = active;
    this.product_categories_id = product_categories_id;
    this.router_link = router_link;
  }
}
