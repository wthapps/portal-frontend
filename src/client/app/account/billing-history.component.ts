import {Component, OnInit, Pipe, PipeTransform}   from '@angular/core';
import {ROUTER_DIRECTIVES, Router}                from '@angular/router';
import {UserService, CONFIG}                      from '../shared/index';
import {TransactionService}                       from './transaction.service';
import {LoadingService}                           from '../partials/loading/loading.service';


@Component({
  moduleId: module.id,
  templateUrl: 'billing-history.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ],
  providers: [
    TransactionService,
    LoadingService
  ]
})

export class BillingHistoryComponent implements OnInit{
  PanelTitle:string = 'Billing history';
  public transactions: any[] = [];

  constructor(
    private _userService:UserService,
    private _router:Router,
    private _transactionService: TransactionService,
    private _loadingService: LoadingService
  ) {
    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }
  }

  ngOnInit(): void {
    this._loadingService.start();
    this._transactionService.list(`users/${this._userService.profile.id}/transactions`)
      .subscribe((response) => {
        this.transactions = response.data;
        this.transactions.map((t) => {
          t.created_at = new Date(t.created_at);
        });
        this._loadingService.stop();
        },
        error => {
          console.log("Billing history error", error);
          this._loadingService.stop();
        })
  }
}
