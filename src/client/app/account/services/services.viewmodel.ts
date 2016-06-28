import {
  Router
}                            from '@angular/router';
import {
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Validators
}                            from '@angular/common';
import {
  IDynamicDnsViewModel,
  IMSOutlookAddonViewModel,
  IServicesViewModel,
  IViewModelBase
}                            from './services.interface';
import {
  Category,
  AddonService,
  Action
}                            from './services.model';
import {
  ServicesService
}                            from './services.service';
import {
  UserService
}                            from '../../shared/index';
import {
  CustomValidators
}                            from '../../shared/validator/custom-validators';

export class DynamicDnsViewModel implements IDynamicDnsViewModel {
  public downloadlink:string;
  public group:ControlGroup;
  public host_button_text:string;
  public is_creating:boolean;
  public show_information_view:boolean;
  public show_configuration_view:boolean;
  public show_congratulation_view:boolean;
  public actions:Action[] = [];
  constructor(public context:Object,
    private _service:ServicesService,
    private _router:Router,
    private _userService:UserService,
    private _builder:FormBuilder,
    private _controller:Object) {
  }
  public load():void {
    this.loadData();
  }
  public unload():void {
  }
  onAction(action: Action) : void {
    if (action.name == 'Add') {
      this.changeView('Add');
    }
    if (action.name == 'Manage') {
      this._router.navigateByUrl(action.router);
    }
    if (action.name == 'Create') {
      this.onAddHost(this.group.controls['host'].value, action);
    }
    if (action.name == 'Cancel') {
      this.changeView();
    }
  }
  onAddHost(hostname:string,action:Action) : void {
    this.is_creating = true;
    action.name = this.host_button_text = "Creating"; //@TODO: missing translation
    let cancelBtn = this.actions.find(o => o.name == 'Cancel');
    cancelBtn.disabled = this.is_creating;
    action.disabled = this.is_creating;
    let record = {
      "id": 0,
      "name": hostname,
      "type": 'A',
      "content": '127.0.0.1',
      "ttl": 600,
      "priority": 0,
      "domain_id": 0
    };
    let body = JSON.stringify(record);
    this._service.addHost(body).subscribe(
      result => {
        this.clearForm();
        this.changeView('Done');
        action.name = 'Create';
        this.is_creating = false;
        cancelBtn.disabled = this.is_creating;
        action.disabled = this.is_creating;
        /*this._service.addService(this.context.id).subscribe(
          r => {
            this.clearForm();
            this.changeView('Done');
            action.name = 'Create';
            this.is_creating = false;
            cancelBtn.disabled = this.is_creating;
            action.disabled = this.is_creating;
          },
          e => {
            this.clearForm();
            this.is_creating = false;
            cancelBtn.disabled = this.is_creating;
            action.disabled = this.is_creating;
          }
        );*/
      },
      error => {
        this.clearForm();
        this.is_creating = false;
        cancelBtn.disabled = this.is_creating;
        action.disabled = this.is_creating;
      }
    );
  }
  onCancel() : void {
    this.changeView();
  }
  private changeView(action?:string) : void {
    this.show_information_view = (action == '' || action == null);
    this.show_configuration_view = (action == 'Add');
    this.show_congratulation_view = (action == 'Done');

    if (this.show_information_view) {
      this.actions = [];
      if (this.context.created) {
        this.actions.push(new Action(0,'Manage','/account/dns'));
      }
      else {
        this.actions.push(new Action(0,'Add',''));
      }
    }

    if (this.show_configuration_view) {
      this.actions = [];
      this.actions.push(new Action(0,'Create',''));
      this.actions.push(new Action(1,'Cancel',''));
    }

    if (this.show_congratulation_view) {
      this.actions = [];
      this.actions.push(new Action(0,'Manage','/account/dns'));
    }
  }
  private clearForm() : void {
    this.group.controls['host'].updateValue('');
    this.group.controls['host'].setErrors(null);
    this.host_button_text = "Create"; //@TODO: missing translation
    this.is_creating = false;
  }
  private loadData() : void {
    this._service.getProduct(1).subscribe(
      product => {
        this.downloadlink = product.download_link;
      },
      error => {
        console.error(error);
      }
    );
    this.group = this._builder.group({
      host: ['',
        Validators.compose([Validators.required, CustomValidators.ipHostFormat])
      ]
    });
    this.clearForm();
    this.changeView();
  }
}

export class MSOutlookAddonViewModel implements IMSOutlookAddonViewModel {
  public show_information_view:boolean;
  public show_configuration_view:boolean;
  public show_congratulation_view:boolean;
  public downloadlink:string;
  public actions:Action[] = [];
  constructor(public context:Object,
    private _service:ServicesService,
    private _router:Router,
    private _userService:UserService,
    private _builder:FormBuilder,
    private _controller:Object) {
  }
  public load():void {
    this.loadData();
  }
  public unload():void {
  }
  onAction(action: Action) : void {
    if (action.name == 'Add') {
      this.changeView('Done');
      /*this._service.addService(this.context.id).subscribe(
        r => {
          this.changeView('Done');
        }
      );*/
    }
    if (action.name == 'Manage' || action.name == 'Learn more') {
      this._router.navigateByUrl(action.router);
    }
    if (action.name == 'Create') {
      
    }
    if (action.name == 'Cancel') {
      
    }
  }
  private changeView(action?:string) : void {
    this.show_information_view = (action == '' || action == null);
    this.show_configuration_view = (action == 'Add');
    this.show_congratulation_view = (action == 'Done');

    if (this.show_information_view) {
      this.actions = [];
      if (this.context.created) {
        this.actions.push(new Action(0,'Learn more','/support'));
      }
      else {
        this.actions.push(new Action(0,'Add',''));
      }
    }

    if (this.show_configuration_view) {
      this.actions = [];
      this.actions.push(new Action(0,'Create',''));
      this.actions.push(new Action(1,'Cancel',''));
    }

    if (this.show_congratulation_view) {
      this.actions = [];
      this.actions.push(new Action(0,'Learn more','/support'));
    }
  }
  private loadData() : void {
    this._service.getProduct(1).subscribe(
      product => {
        this.downloadlink = product.download_link;
      },
      error => {
        console.error(error);
      }
    );
    this.changeView();
  }
}

export class ServicesViewModel implements IServicesViewModel {

  public panelTitle: string = 'Find Services or Add-ons'; //@TODO: missing translation
  public categories: Category[] = []; 
  public categoryId: number;
  public context:Object;

  public addonservices : AddonService[] = [];
  public addonservicesId : number;
  public items : IViewModelBase[] = [];

  constructor(private _servicesService:ServicesService,
    private _router:Router,
    private _userService:UserService,
    private _builder:FormBuilder,
    private _controller:Object) {}

  public load():void {
    this.init();
  }
  public unload():void {
    for (var i in this.items) {
      this.items[i].unload();
    }
  }

  onCategoryIdChanged(categoryId : number) : void {
    this.refresh(categoryId);
  }

  onAction(action: Action) : void {
    if (action.id === 2 && action.router != null && action.router.length > 0) {
      this._router.navigateByUrl(action.router);
    }

    if (action.id === 0 && action.router != null && action.router.length > 0) {
      this._router.navigateByUrl(action.router);
    }

    if (action.id === 1) {
    }
  }

  private init() : void {
    if (!this.verifyLogin()) {
      return;
    }
    
    this.categories = this._servicesService.getCategories();
    this.categoryId = 0;
    this.refresh(this.categoryId);

    /*this._servicesService.getCategories().subscribe(
      categories => {
        this.categories = categories;
        this.categoryId = 0;
        this.refresh(this.categoryId);
      },
      error => {
        console.error(error);
      }
    );*/
  }

  //@TODO: need to send to owner to manage this
  private verifyLogin() : boolean {
    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(
        `/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`
      );
      return false;
    }
    return true;
  }

  private refresh(categoryId : number) : void {
    this.items = [];
    this.addonservicesId = 0;
    this.addonservices = this._servicesService.getAddonServices(categoryId);
    for (let i in this.addonservices) {
      let item = this.addonservices[i];
      if (item.templateId == "dynamic-dns.html") {
        let ddns = new DynamicDnsViewModel(
          item, 
          this._servicesService, 
          this._router, 
          this._userService,
          this._builder, 
          this._controller
        );
        ddns.load();
        this.items.push(ddns);
      }
      if (item.templateId == "ms-outlook-addon.html") {
        let outlook = new MSOutlookAddonViewModel(
          item, 
          this._servicesService, 
          this._router, 
          this._userService, 
          this._builder,
          this._controller
        );
        outlook.load();
        this.items.push(outlook);
      }
    }
    /*this._servicesService.getAddonServices(categoryId).subscribe(
      addonservices => {
        this.addonservicesId = 0;
        this.addonservices = addonservices;
      },
      error => {
        console.error(error);
      }
    );*/
  }
}
