//Ref: http://stackoverflow.com/questions/37185820/how-to-place-a-dynamic-component-in-a-container
//@TODO: will move to shared
import {
  Component,
  Input,
  ViewContainerRef,
  OnInit,
  ComponentResolver,
  ViewChild
}                        from '@angular/core';
import {
  FORM_DIRECTIVES
}                        from '@angular/common';
import {
  ROUTER_DIRECTIVES
}                        from '@angular/router';

@Component({
  selector: 'content-presenter',
  template: '<div #wthContentPresenter></div>',
  directives: FORM_DIRECTIVES
})

export class ContentPresenterComponent implements OnInit {

  @Input('src') src:string;

  @Input() context:Object;

  @ViewChild('wthContentPresenter', {read: ViewContainerRef})
  private _contentTarget:ViewContainerRef;

  constructor(private _componentResolver:ComponentResolver) {
  }

  ngOnInit() {
    let content:any = this.createContent(this.src, this.context);
    this._componentResolver.resolveComponent(content)
      .then((factory:any) => this._contentTarget.createComponent(factory));
  }

  private createContent(resourcePath:string, viewModel:Object) {
    @Component({
      selector: 'content-component',
      templateUrl: (()=> {
        return resourcePath;
      })(),
      directives: [
        FORM_DIRECTIVES,
        ROUTER_DIRECTIVES
      ]
    })
    class ContentComponent implements OnInit {
      @Input()
      context:Object;

      ngOnInit() {
        this.context = viewModel;
      }
    }
    return ContentComponent;
  }
}
