import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Page, Purchase, PurchaseInfo } from 'src/app/interface/data';
import * as moment from 'moment-timezone';
import { lastValueFrom } from 'rxjs';
import { WpJsonService } from 'src/app/services/wp-json.service';
import { environment } from 'src/environments/environment';
import { CookiesService } from 'src/app/services/cookies.service';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseInfoComponent } from 'src/app/components/purchase-info/purchase-info.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  @Input() currentPage!: Page;
  @Input() handleHttpError!: (error: HttpErrorResponse) => void;
  @Output() deauthorization = new EventEmitter<boolean>(false);
  public lastViewOrder: number = 3;
  public ordersLoadingStatus: boolean = true;
  readonly moment = moment;
  public purchases: Purchase[] = [];
  public purchasesShortArray: Purchase[] = [];

  constructor(
    private wpJsonService: WpJsonService,
    private cookiesService: CookiesService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getOrders();
  }

  async getOrders() {
    const token = this.cookiesService.getItem('token');
    if (!token) {
      this.cookiesService.deleteCookie('token');
      this.deauthorization.emit(true);
      return;
    }
    const customerInfo = await lastValueFrom(
      this.wpJsonService.getCustomerInfo(
        environment.systemId,
        token,
        environment.icardProxy
      )
    );
    if (
      customerInfo.customer_info?.errorCode === 'Customer_CustomerNotFound' ||
      'Error' in customerInfo
    ) {
      this.ordersLoadingStatus = false;
      return;
    }
    const purchases: Purchase[] = (
      await lastValueFrom(
        this.wpJsonService.getTransactions(
          environment.systemId,
          token,
          environment.icardProxy,
          30
        )
      )
    )[customerInfo.customer_info?.id];

    const purchasesInfo: PurchaseInfo[] = (
      await lastValueFrom(
        this.wpJsonService.getTransactionsInfo(
          environment.systemId,
          token,
          environment.icardProxy,
          30
        )
      )
    )['purchase'];

    this.purchases = purchases
      .map<Purchase>((purchase) => {
        // const id = purchase.ID.slice(0,36).toLowerCase();
        // purchase.Transactions = transactions.filter((transaction) => {
        //   const same = transaction.Purchase === id;
        //   transaction.HasPurchase = same;
        //   return same;
        // });
        purchase.more_info =
          purchasesInfo.find(
            (purchaseInfo: PurchaseInfo) =>
              Number(purchaseInfo.number) === purchase.orderNumber
          ) || null;
        return purchase;
      })
      .filter((purchase: Purchase) =>
        ['PayFromWallet', 'CancelPayFromWallet', 'RefillWallet'].includes(
          purchase.transactionType
        )
      );
    
    this.purchasesShortArray = this.purchases.slice(0, this.lastViewOrder);
    this.ordersLoadingStatus = false;
  }

  getMoreOrders() {
    this.lastViewOrder += 4;
    this.purchasesShortArray = this.purchases.slice(0, this.lastViewOrder);
  }

  showPurchaseInfo(purchaseInfo: PurchaseInfo) {
    const dialogRef = this.dialog.open(PurchaseInfoComponent, {
      data: {purchaseInfo},
    });
  }
}
