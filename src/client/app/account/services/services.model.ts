export class Category {
  id: number;
  name:  string;
}
export class Action {
  constructor();
  constructor(
    id:number,
    name:string,
    router:string,
    disabled:boolean);
  constructor(
    public id?:any,
    public name?:any,
    public router?:any,
    public disabled?:any) {
    this.id = id ? id : 0;
    this.name = name ? name : '';
    this.router = router ? router : '';
    this.disabled = disabled ? disabled : false;
  }
}
export class AddonService {
  constructor();
  constructor(
    id:number, 
    name:string, 
    author:string, 
    categories:Category[], 
    actions:Action[], 
    description:string,
    img:string,
    templateId:string,
    templatePath:string,
    created:boolean
  );
  constructor(
    public id?:any, 
    public name?:any, 
    public author?:any, 
    public categories?:any, 
    public actions?:any, 
    public description?:any,
    public img?:any,
    public templateId?:any,
    public templatePath?:any,
    public created?:any) {
    this.id = id ? id : 0;
    this.name = name ? name : '';
    this.author = author ? author : '';
    this.categories = categories ? categories : [];
    this.actions = actions ? actions : [];
    this.description = description ? description : '';
    this.img = img ? img : '';
    this.templateId = templateId ? templateId : '';
    this.templatePath = templatePath ? templatePath : '';
    this.created = created ? created : false;
  }
}
