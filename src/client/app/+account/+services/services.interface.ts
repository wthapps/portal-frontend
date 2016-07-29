export interface IViewModelBase {
  load():void;
  unload():void;
}
export interface IDynamicDnsViewModel extends IViewModelBase {}
export interface IMSOutlookAddonViewModel extends IViewModelBase {}
export interface IServicesViewModel extends IViewModelBase {}
