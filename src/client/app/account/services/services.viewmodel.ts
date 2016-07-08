import {
  Router
}                            from '@angular/router';
import {
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
  UserService,
  StreamEmitter,
  UserProductEventArgs,
  CustomValidators,
  HttpStatusCode,
  DialogService
}                            from '../../shared/index';

export class DynamicDnsViewModel implements IDynamicDnsViewModel {
  public group:ControlGroup;
  public is_creating:boolean;
  public show_information_view:boolean;
  public show_configuration_view:boolean;
  public show_congratulation_view:boolean;
  public actions:Action[] = [];
  public category_name:string;
  public inValidPlan:boolean;
  public error_message:string;

  constructor(public context:Object,
              private _service:ServicesService,
              private _router:Router,
              private _userService:UserService,
              private _builder:FormBuilder,
              private _controller:Object,
              private _streamEmitter:StreamEmitter,
              private _dialogService:DialogService) {
  }

  public load():void {
    this.loadData();
  }

  public unload():void {
  }

  onAction(action:Action):void {
    if (this.inValidPlan) {
      this.showUpgrading();
      return;
    }
    if (action.name == 'Add') {
      this._service.addService(this.context.id).subscribe(
        r => {
          let message = new UserProductEventArgs();
          message.data = this.context;
          this._streamEmitter.UserProducts.send(message);
          this.changeView('Add');
        },
        e => {
          if (e['status'] == HttpStatusCode.PaymentRequired) {
            this.showUpgrading();
          } else {
          }
        }
      );
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

  onAddHost(hostname:string, action:Action):void {
    this.is_creating = true;
    action.name = 'Creating'; //@TODO: missing translation
    let cancelBtn = this.actions.find(o => o.name == 'Cancel');
    cancelBtn.disabled = this.is_creating;
    action.disabled = this.is_creating;
    let record = {
      'id': 0,
      'name': hostname,
      'type': 'A',
      'content': '127.0.0.1',
      'ttl': 600,
      'priority': 0,
      'domain_id': 0
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
      },
      error => {
        if (error['status'] == HttpStatusCode.PaymentRequired) {
          this.showUpgrading();
        } else if (error['status'] == HttpStatusCode.Conflict) {
          this.error_message = 'The hostname ' + hostname + '.wthdns.com has been taken!';
        }
        this.clearForm();
        action.name = 'Create';
        this.is_creating = false;
        cancelBtn.disabled = this.is_creating;
        action.disabled = this.is_creating;
      }
    );
  }

  onCancel():void {
    this.changeView();
  }

  private changeView(action?:string):void {
    this.show_information_view = (action == '' || action == null);
    this.show_configuration_view = (action == 'Add');
    this.show_congratulation_view = (action == 'Done');

    if (this.show_information_view) {
      this.actions = [];
      if (this.context.created) {
        this.actions.push(new Action(0, 'Manage', '/account/dns'));
      } else {
        this.actions.push(new Action(0, 'Add', ''));
      }
    }

    if (this.show_configuration_view) {
      this.actions = [];
      this.actions.push(new Action(0, 'Create', ''));
      this.actions.push(new Action(1, 'Cancel', ''));
    }

    if (this.show_congratulation_view) {
      this.actions = [];
      this.actions.push(new Action(0, 'Manage', '/account/dns'));
    }
  }

  private clearForm():void {
    this.group.controls['host'].updateValue('');
    this.group.controls['host'].setErrors(null);
    this.is_creating = false;
  }

  private loadData():void {
    this.group = this._builder.group({
      host: ['',
        Validators.compose([Validators.required, CustomValidators.ipHostFormat])
      ]
    });
    this.clearForm();
    this.changeView();
  }

  private showUpgrading():void {
    this._dialogService.activate(
      'Upgrading your accounts to continute?',
      'Find Services or Add-ons',
      'Yes',
      'No')
      .then((responseOK) => {
        if (responseOK) {
          this._router.navigateByUrl('/account/payment');
        }
      });
  }
}

export class MSOutlookAddonViewModel implements IMSOutlookAddonViewModel {
  public show_information_view:boolean;
  public show_configuration_view:boolean;
  public show_congratulation_view:boolean;
  public actions:Action[] = [];
  public category_name:string;
  public inValidPlan:boolean;

  constructor(public context:Object,
              private _service:ServicesService,
              private _router:Router,
              private _userService:UserService,
              private _builder:FormBuilder,
              private _controller:Object,
              private _streamEmitter:StreamEmitter,
              private _dialogService:DialogService) {
  }

  public load():void {
    this.loadData();
  }

  public unload():void {
  }

  onAction(action:Action):void {
    if (this.inValidPlan) {
      this.showUpgrading();
      return;
    }
    if (action.name == 'Add') {
      this._service.addService(this.context.id).subscribe(
        r => {
          this.changeView('Done');
          let message = new UserProductEventArgs();
          message.data = this.context;
          this._streamEmitter.UserProducts.send(message);
        },
        e => {
          if (e['status'] == HttpStatusCode.PaymentRequired) {
            this.showUpgrading();
          } else {
          }
        }
      );
    }
    if (action.name == 'Manage' || action.name == 'Learn more') {
      this._router.navigateByUrl(action.router);
    }
    if (action.name == 'Create') {

    }
    if (action.name == 'Cancel') {

    }
  }

  private changeView(action?:string):void {
    this.show_information_view = (action == '' || action == null);
    this.show_configuration_view = (action == 'Add');
    this.show_congratulation_view = (action == 'Done');

    if (this.show_information_view) {
      this.actions = [];
      if (this.context.created) {
        this.actions.push(new Action(0, 'Learn more', '/support'));
      } else {
        this.actions.push(new Action(0, 'Add', ''));
      }
    }

    if (this.show_configuration_view) {
      this.actions = [];
      this.actions.push(new Action(0, 'Create', ''));
      this.actions.push(new Action(1, 'Cancel', ''));
    }

    if (this.show_congratulation_view) {
      this.actions = [];
      this.actions.push(new Action(0, 'Learn more', '/support'));
    }
  }

  private loadData():void {
    this.changeView();
  }

  private showUpgrading():void {
    this._dialogService.activate(
      'Upgrading your accounts to continute?',
      'Find Services or Add-ons',
      'Yes',
      'No')
      .then((responseOK) => {
        if (responseOK) {
          this._router.navigateByUrl('/account/payment');
        }
      });
  }
}

export class ServicesViewModel implements IServicesViewModel {
  public panelTitle:string = 'Find Services or Add-ons'; //@TODO: missing translation
  public categories:Category[] = [];
  public categoryId:number;
  public items:IViewModelBase[] = [];
  public inValidPlan:boolean = false;
  public user_products:AddonService[] = [];
  public hasUserProducts:boolean = false;

  constructor(private _servicesService:ServicesService,
              private _router:Router,
              private _userService:UserService,
              private _builder:FormBuilder,
              private _controller:Object,
              private _streamEmitter:StreamEmitter,
              private _dialogService:DialogService) {
  }

  public load():void {
    this.init();
  }

  public unload():void {
    for (var i in this.items) {
      this.items[i].unload();
    }
  }

  onCategoryIdChanged(categoryId:number):void {
    this.refresh(categoryId);
  }

  private init():void {
    if (!this.verifyLogin()) {
      return;
    }
    this.inValidPlan = false;
    this.user_products = [];
    this._servicesService.getUserProducts().subscribe(
      addonservices => {
        this.loadData(addonservices);
      },
      error => {
        let body = JSON.parse(error['_body']);
        if (error['status'] == HttpStatusCode.PaymentRequired) {
          this.inValidPlan = true;
          if (body.data != 'empty') {
            let result = <AddonService[]>body.data;
            this.loadData(result);
          }
        } else {
        }
      }
    );
  }

  private loadData(products:AddonService[]):void {
    this._servicesService.getCategories().subscribe(
      categories => {
        this.categories.push(new Category('', 0, 'Allcategories', 'All categories', ''));
        for (var i in categories) {
          this.categories.push(categories[i]);
        }
        this.categoryId = 0;
        this.refresh(this.categoryId);
        this.user_products = products;
        this.hasUserProducts = products.length != 0;
        this._streamEmitter.UserProducts.send(new UserProductEventArgs(products));
      },
      error => {
        console.error(error);
      }
    );
  }

  //@TODO: need to send to owner to manage this
  private verifyLogin():boolean {
    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(
        `/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`
      );
      return false;
    }
    return true;
  }

  private createItems(addonservices:AddonService[], inValidPlan:boolean = false) {
    for (let i in addonservices) {
      let item = addonservices[i];
      let index = this.categories.findIndex(o => o.id == item.product_categories_id);
      let category = this.categories[index];
      index = this.user_products.findIndex(o => o.id == item.id);
      item.created = index != -1;
      if (item.template_id == 'dynamic-dns.html') {
        let ddns = new DynamicDnsViewModel(
          item,
          this._servicesService,
          this._router,
          this._userService,
          this._builder,
          this._controller,
          this._streamEmitter,
          this._dialogService
        );
        ddns.category_name = category.display_name;
        ddns.inValidPlan = inValidPlan;
        ddns.load();
        this.items.push(ddns);
      }
      if (item.template_id == 'ms-outlook-addon.html') {
        let outlook = new MSOutlookAddonViewModel(
          item,
          this._servicesService,
          this._router,
          this._userService,
          this._builder,
          this._controller,
          this._streamEmitter,
          this._dialogService
        );
        outlook.category_name = category.display_name;
        outlook.inValidPlan = inValidPlan;
        outlook.load();
        this.items.push(outlook);
      }
    }
  }

  private refresh(categoryId:number):void {
    this.items = [];
    this._servicesService.getAddonServices().subscribe(
      addonservices => {
        this.createItems(this.getAddonServiceByCategoryId(categoryId, addonservices), this.inValidPlan);
      },
      error => {
        let body = JSON.parse(error['_body']);
        if (error['status'] == HttpStatusCode.PaymentRequired) {
          if (body.data != 'empty') {
            this.createItems(this.getAddonServiceByCategoryId(categoryId, <AddonService[]>body.data), true);
          }
        } else {
        }
      }
    );
  }

  private getAddonServiceByCategoryId(categoryId:number,
                                      addonservices:AddonService[]):AddonService[] {
    let service:AddonService[] = [];
    for (var i in addonservices) {
      if (categoryId == 0) {
        service.push(addonservices[i]);
        continue;
      }
      if (addonservices[i].product_categories_id == categoryId) {
        service.push(addonservices[i]);
      }
    }
    return service;
  }
}
