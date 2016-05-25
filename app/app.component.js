System.register(['@angular/core', '@angular/http', '@angular/router', 'rxjs/Rx', './home/home.component', './products/product-list.component', './products/product-detail.component', './products/product.service', './login/login.component', './register/register.component', './account/forgot-password.component', './account/reset-email-sent.component', './account/password-reset.component', './account/password-reset-complete.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, router_1, home_component_1, product_list_component_1, product_detail_component_1, product_service_1, login_component_1, register_component_1, forgot_password_component_1, reset_email_sent_component_1, password_reset_component_1, password_reset_complete_component_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (_1) {},
            function (home_component_1_1) {
                home_component_1 = home_component_1_1;
            },
            function (product_list_component_1_1) {
                product_list_component_1 = product_list_component_1_1;
            },
            function (product_detail_component_1_1) {
                product_detail_component_1 = product_detail_component_1_1;
            },
            function (product_service_1_1) {
                product_service_1 = product_service_1_1;
            },
            function (login_component_1_1) {
                login_component_1 = login_component_1_1;
            },
            function (register_component_1_1) {
                register_component_1 = register_component_1_1;
            },
            function (forgot_password_component_1_1) {
                forgot_password_component_1 = forgot_password_component_1_1;
            },
            function (reset_email_sent_component_1_1) {
                reset_email_sent_component_1 = reset_email_sent_component_1_1;
            },
            function (password_reset_component_1_1) {
                password_reset_component_1 = password_reset_component_1_1;
            },
            function (password_reset_complete_component_1_1) {
                password_reset_complete_component_1 = password_reset_complete_component_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                    this.pageTitle = "Welcome to WTHApps";
                }
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'wth-app',
                        templateUrl: 'app/app.component.html',
                        directives: [
                            router_1.ROUTER_DIRECTIVES
                        ],
                        providers: [
                            product_service_1.ProductService,
                            http_1.HTTP_PROVIDERS,
                            router_1.ROUTER_PROVIDERS
                        ]
                    }),
                    router_1.Routes([
                        { path: '/', component: home_component_1.HomeComponent },
                        { path: '/products/:id', component: product_detail_component_1.ProductDetailComponent },
                        { path: '/products', component: product_list_component_1.ProductListComponent },
                        { path: '/login', component: login_component_1.LoginComponent },
                        { path: '/register', component: register_component_1.RegisterComponent },
                        { path: '/account/forgot_password', component: forgot_password_component_1.ForgotPasswordComponent },
                        { path: '/account/reset_email_sent', component: reset_email_sent_component_1.ResetEmailSentComponent },
                        { path: '/account/password_reset', component: password_reset_component_1.PasswordResetComponent },
                        { path: '/account/password_reset_complete', component: password_reset_complete_component_1.PasswordResetCompleteComponent }
                    ]), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map