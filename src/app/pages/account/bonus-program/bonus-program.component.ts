import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { orderStatuses, PageList, PageListWithBonus } from 'src/app/app.constants';
import { BonusProgramAccount, Page, Purchase, Transaction } from 'src/app/interface/data';
import { JsonrpcService, RpcService } from 'src/app/services/jsonrpc.service';
import * as moment from 'moment-timezone';
import * as barcode from 'jsbarcode';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bonus-program',
  templateUrl: './bonus-program.component.html',
  styleUrls: ['./bonus-program.component.scss']
})
export class BonusProgramComponent implements OnInit {

  public accountData!: BonusProgramAccount;
  public purchases: Purchase[] = [];
  public loadingBonuses: boolean = false;
  readonly orderStatuses = orderStatuses;
  readonly moment = moment;
  readonly pageList = environment.hasBonusProgram ? PageListWithBonus : PageList;
  public currentPage: Page = this.pageList[1];

  constructor(
    private jsonrpc: JsonrpcService,
  ) { }

  ngOnInit(): void {
    this.getAccountData();
  }

  async getAccountData(): Promise<void>{
    this.loadingBonuses = true;
    this.accountData = (await lastValueFrom(
      this.jsonrpc.rpc({
        method: 'GetAccounts',
        params: []
      },
      RpcService.bonusService
    )))['Cards'][0];
    this.loadingBonuses = false;
    
    barcode("#barcode")
    .options({font: "OCR-B"}) // Will affect all barcodes
    .EAN13(`${this.accountData.CardNumber}`.padStart(12, "0"), {fontSize: 18, textMargin: 0})
    .render();
    const transactions: Transaction[] = (await lastValueFrom(
      this.jsonrpc.rpc(
        {
          method: 'GetAccountTransactions',
          params: []
        },
        RpcService.bonusService
      )))['Transactions'];

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
      purchase.Transactions = transactions.filter((transaction) => {
        const same = transaction.Purchase === id;
        transaction.HasPurchase = same;
        return same;
      });
      return purchase;
    });
    transactions.forEach((transaction) => {
      if(!transaction.HasPurchase){
  			this.purchases.push({
  				ID: transaction.ID,
          PurchaseDate: transaction.Date,
          Transactions: [transaction],
          IsSingleTransaction: true,
        })
      }
    });
    this.purchases = this.purchases.sort((a,b) => {
      return moment(a.PurchaseDate).date() - moment(b.PurchaseDate).date();
    });
  }

}
