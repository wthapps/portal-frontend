export class Category {
  constructor();
  constructor(
    uuid:string,
    id:number,
    name:string,
    display_name:string,
    description:string
  );
  constructor(
    public uuid?:string = '',
    public id?:number = 0,
    public name?:string = '',
    public display_name?:string = '',
    public description?:string = ''
  ) {}
}
export class Action {
  constructor();
  constructor(
    id:number,
    name:string,
    router:string,
    disabled:boolean);
  constructor(
    public id?:any = 0,
    public name?:any = '',
    public router?:any = '',
    public disabled?:any = false
  ) {}
}
export class AddonService {
  constructor();
  constructor(
    id:number,
    uuid:string,
    name:string,
    display_name:string,
    download_link:string,
    description:string,
    img_src:string,
    template_id:string,
    template_path:string,
    created:boolean,
    active:boolean,
    product_categories_id:number,
    router_link:string
  );
  constructor(
    public id?:number = 0,
    public uuid?:string = '',
    public name?:string = '',
    public display_name?:string = '',
    public download_link?:string = '',
    public description?:string = '',
    public img_src?:string = '',
    public template_id?:string = '',
    public template_path?:string = '',
    public created?:boolean = false,
    public active?:boolean = false,
    public product_categories_id?:number = 0,
    public router_link?:string = ''
  ) {}
}
