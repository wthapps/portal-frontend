import {Form} from "./form.model";

declare var _: any;

export class FormManger {
  forms: Array<Form> = [new Form({id: 'phat', show: true}), new Form({id: 'abc', show: true})];


  show(formId:string) {
    this.forms = _.map(
      this.forms, this.hideForm
    );
    let newform = _.find(this.forms, function(form) {return form.id == formId; });

    if (!newform) {
      newform = new Form({id: formId, show:true});
      this.forms.push(newform);
    } else {
      this.forms = _.map(
        this.forms, form => this.showOnly(form, formId)
      );
    }
  }

  isShow(formId:string){
    let form = _.find(this.forms, function(form) {return form.id == formId; });
    if (form) {
      return form.show;
    }
    return false;
  }

  showAll(formIds:Array<string>) {

  }

  hideAll() {
    this.forms = _.map(
      this.forms, this.hideForm
    );
  }

  private hideForm(form:Form) {
    form.show = false;
    return form;
  }

  private showOnly(form:Form, formId:string) {
    // console.log(form, formId);
    if (form.id == formId) {
      form.show = true;
    }
    return form;
    // console.log(form, formId);
  }
}
