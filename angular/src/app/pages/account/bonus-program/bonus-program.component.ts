import { Component, Inject, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { orderStatuses, PageList, PageListWithBonus } from 'src/app/app.constants';
import { BonusProgramAccount, Page, Purchase, Transaction } from 'src/app/interface/data';
import { JsonrpcService, RpcService } from 'src/app/services/jsonrpc.service';
import * as moment from 'moment-timezone';
import * as barcode from 'jsbarcode';
import { environment } from 'src/environments/environment';
import { AppleWalletService } from 'src/app/services/apple-wallet.service';
import { CookiesService } from 'src/app/services/cookies.service';
import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  public userName: string = '';
  public deviceType: 'ios' | 'android' | null = null;

  constructor(
    private jsonrpc: JsonrpcService,
    private appleWallet: AppleWalletService,
    private cookiesService: CookiesService,
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getAccountData();
    this.getTypeDevice()
  }

  getTypeDevice() {
    const userAgent = window.navigator.userAgent.toLowerCase()
    const ios = /iphone|ipod|ipad/.test( userAgent );
    this.deviceType = ios ? 'ios' : 'android'
  }

  async getAccountData(): Promise<void>{
    this.loadingBonuses = true;

    this.jsonrpc.rpc({
      method: 'getAdditionalInfo',
      params: []
    }, RpcService.authService, true).subscribe({
      next: (res) => {
        this.userName = res.data.first_name
      },
      error: (err) => {
        console.error('Error: ', err)
      }
    });

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


  async addCardToWallet(e: any) {
    e.preventDefault()
    const token = this.cookiesService.getItem('token')
    const accountData = (await lastValueFrom(
      this.jsonrpc
        .rpc(
          {
            method: 'getTokenData',
            params: [],
          },
          RpcService.authService,
          true
        )
    )).data
    if (token && accountData.user_id) {
      this.appleWallet.generateCard(token, accountData.user_id).subscribe({
        next: (res: any) => {
          this.document.location.href = res.url
        },
        error: (err) => {
          console.log('Error: ', err);
          
        }
      })
    }
    
  }

}
