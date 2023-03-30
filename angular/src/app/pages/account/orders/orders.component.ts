import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDateFilter, Page, Purchase, PurchaseInfo } from 'src/app/interface/data';
import * as moment from 'moment-timezone';
import { lastValueFrom } from 'rxjs';
import { WpJsonService } from 'src/app/services/wp-json.service';
import { environment } from 'src/environments/environment';
import { CookiesService } from 'src/app/services/cookies.service';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseInfoComponent } from 'src/app/components/purchase-info/purchase-info.component';
import { dateFilterOptions } from 'src/app/app.constants';

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


  public dateFilterOptions = dateFilterOptions
  public defaultFilterType = 'currentMonth';
  private startOfMonth = moment().startOf('month').format('YYYY-MM-DD HH:mm');
  public filteredOfDatePurchases: Purchase[] = []

  constructor(
    private wpJsonService: WpJsonService,
    private cookiesService: CookiesService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getOrders();
  }

  dateFilter(dateFilter: IDateFilter) {
    this.lastViewOrder = 3
    switch (dateFilter.filterType) {
      case 'between':
        this.filteredOfDatePurchases = this.purchases.filter((value) => {
          return moment(value.transactionCreateDate).isBetween(dateFilter.from, moment(dateFilter.to).add(1, 'day'))
        })
        break;

      case 'currentMonth':
        this.filteredOfDatePurchases = this.purchases.filter((value) => {
          return moment(value.transactionCreateDate).isAfter(this.startOfMonth)
        })
        break;

      case 'lastMonth':
        this.filteredOfDatePurchases = this.purchases.filter((value) => {
          return moment(value.transactionCreateDate).isBetween(moment(this.startOfMonth).subtract(1, 'month'), this.startOfMonth)
        })
        break;
    
      default:
        this.filteredOfDatePurchases = this.purchases
        break;
    }
    this.purchasesShortArray = this.filteredOfDatePurchases.slice(0, this.lastViewOrder);

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
    
    this.dateFilter({filterType: this.defaultFilterType})
    this.ordersLoadingStatus = false;
  }

  getMoreOrders() {
    this.lastViewOrder += 4;
    this.purchasesShortArray = this.filteredOfDatePurchases.slice(0, this.lastViewOrder);
  }

  showPurchaseInfo(purchaseInfo: PurchaseInfo) {
    const dialogRef = this.dialog.open(PurchaseInfoComponent, {
      data: {purchaseInfo},
    });
  }
}
