import {Form} from "../models/form.model";
import {Injectable} from "@angular/core";

declare var _: any;

@Injectable()
export class FormManagerService {
  // forms: Array<Form> = [new Form({id: 'phat', show: true}), new Form({id: 'abc', show: true})];
  forms: Array<Form> = [];

  // Register new Form into this.forms if not exist
  register(formId:string) {
    let newform = _.find(this.forms, function(form) {return form.id == formId; });
    if (!newform) {
      newform = new Form({id: formId, show:false});
      this.forms.push(newform);
    }
  }

  show(formId:string) {
    this.register(formId);

    this.showOnly(formId);
  }

  hide(formId:string) {
    this.register(formId);

    this.hideOnly(formId);
  }

  showAll(formIds:Array<string>) {
    this.forms = _.map(
      this.forms, this.showForm
    );
  }

  hideAll() {
    this.forms = _.map(
      this.forms, this.hideForm
    );
  }

  isShow(formId:string){
    let form = _.find(this.forms, function(form) {return form.id == formId; });
    if (form) {
      return form.show;
    }
    return false;
  }

  private showOnly(formId:string) {
    this.forms = _.map(
      this.forms, form => this.showIfId(form, formId)
    );
  }

  private hideOnly(formId:string) {
    this.forms = _.map(
      this.forms, form => this.hideIfId(form, formId)
    );
  }

  private hideForm(form:Form) {
    form.show = false;
    return form;
  }

  private showForm(form:Form) {
    form.show = true;
    return form;
  }

  private showIfId(form:Form, formId:string) {
    if (form.id == formId) {
      form.show = true;
    }
    return form;
  }

  private hideIfId(form:Form, formId:string) {
    if (form.id == formId) {
      form.show = false;
    }
    return form;
  }
}
