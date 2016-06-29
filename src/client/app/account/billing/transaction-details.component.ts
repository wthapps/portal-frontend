import {Component, OnInit, Pipe, PipeTransform}   from '@angular/core';
import {ROUTER_DIRECTIVES, Router, RouteSegment}  from '@angular/router';
import {UserService, CONFIG}                      from '../../shared/index';
import {TransactionService}                       from '../transaction.service';
import {LoadingService}                           from '../../partials/loading/loading.service';


@Component({
  moduleId: module.id,
  templateUrl: 'transaction-details.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ],
  providers: [
    TransactionService,
    LoadingService
  ]
})

export class TransactionDetailsComponent implements OnInit{
  pageTitle:string = 'Transaction details';
  trasaction: any;
  trans_id: string;

  constructor(
    private _userService:UserService,
    private _router:Router,
    private _routeSegment: RouteSegment,
    private _transactionService: TransactionService,
    private _loadingService: LoadingService
  ) {
    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }
    this.trans_id = this._routeSegment.getParam('id');
  }

  ngOnInit(): void {

  }

  viewReceipt(event: any): void {
    event.preventDefault();
    this._router.navigate([`account/transactions/${this.trans_id}/receipt`]);
    return;
  }
}
