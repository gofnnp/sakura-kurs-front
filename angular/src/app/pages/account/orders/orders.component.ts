import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Purchase } from 'src/app/interface/data';
import * as moment from 'moment-timezone';
import { lastValueFrom } from 'rxjs';
import { JsonrpcService, RpcService } from 'src/app/services/jsonrpc.service';
import { WpJsonService } from 'src/app/services/wp-json.service';
import { environment } from 'src/environments/environment';
import { CookiesService } from 'src/app/services/cookies.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  @Input() handleHttpError!: (error: HttpErrorResponse) => void;
  @Output() deauthorization = new EventEmitter<boolean>(false)
  public lastViewOrder: number = 3;
  public ordersLoadingStatus: boolean = true;
  readonly moment = moment;
  public purchases: Purchase[] = [];
  public purchasesShortArray: Purchase[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jsonrpc: JsonrpcService,
    private wpJsonService: WpJsonService,
    private cookiesService: CookiesService,
  ) { }

  ngOnInit(): void {
    this.getOrders()
  }

  async getOrders() {
    const token = this.cookiesService.getItem('token')
    if (!token) {
      this.cookiesService.deleteCookie('token')
      this.deauthorization.emit(true)
      return
    }
    const purchases = (await lastValueFrom(
      this.wpJsonService.getTransactions(environment.systemId, token, environment.icardProxy, 30)
    ));

    // this.purchases = purchases.map<Purchase>((purchase) => {
    //   const id = purchase.ID.slice(0,36).toLowerCase();
    //   // purchase.Transactions = transactions.filter((transaction) => {
    //   //   const same = transaction.Purchase === id;
    //   //   transaction.HasPurchase = same;
    //   //   return same;
    //   // });
    //   return purchase;
    // });
    this.purchasesShortArray = this.purchases.slice(0, this.lastViewOrder)
    this.ordersLoadingStatus = false;
  }

  getMoreOrders() {
    this.lastViewOrder += 4;
    this.purchasesShortArray = this.purchases.slice(0, this.lastViewOrder);
  }
}
