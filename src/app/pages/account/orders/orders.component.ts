import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Purchase } from 'src/app/interface/data';
import * as moment from 'moment-timezone';
import { lastValueFrom } from 'rxjs';
import { JsonrpcService, RpcService } from 'src/app/services/jsonrpc.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  @Input() handleHttpError!: (error: HttpErrorResponse) => void;
  public lastViewOrder: number = 3;
  public ordersLoadingStatus: boolean = true;
  readonly moment = moment;
  public purchases: Purchase[] = [];
  public purchasesShortArray: Purchase[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jsonrpc: JsonrpcService,
  ) { }

  ngOnInit(): void {
    this.getOrders()
  }

  async getOrders(){
    const purchases: Purchase[] = (await lastValueFrom(
      this.jsonrpc.rpc(
        {
          method: 'GetAccountPurchase',
          params: []
        },
        RpcService.bonusService
      )))['Purchases'];

    this.purchases = purchases.map<Purchase>((purchase) => {
      const id = purchase.ID.slice(0,36).toLowerCase();
      // purchase.Transactions = transactions.filter((transaction) => {
      //   const same = transaction.Purchase === id;
      //   transaction.HasPurchase = same;
      //   return same;
      // });
      return purchase;
    });
    this.purchasesShortArray = this.purchases.slice(0, this.lastViewOrder)
    this.ordersLoadingStatus = false;
  }

  getMoreOrders() {
    this.lastViewOrder += 4;
    this.purchasesShortArray = this.purchases.slice(0, this.lastViewOrder);
  }
}
