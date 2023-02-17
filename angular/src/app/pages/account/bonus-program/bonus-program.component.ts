import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
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
import { WpJsonService } from 'src/app/services/wp-json.service';

@Component({
  selector: 'app-bonus-program',
  templateUrl: './bonus-program.component.html',
  styleUrls: ['./bonus-program.component.scss']
})
export class BonusProgramComponent implements OnInit {
  @Input() currentPage!: Page;
  @Output() deauthorization = new EventEmitter<boolean>(false)
  public accountData!: BonusProgramAccount;
  public purchases: Purchase[] = [];
  public loadingBonuses: boolean = false;
  readonly orderStatuses = orderStatuses;
  readonly moment = moment;
  readonly pageList = environment.hasBonusProgram ? PageListWithBonus : PageList;
  public userName: string = '';
  public deviceType: 'ios' | 'android' | null = null;

  constructor(
    private jsonrpc: JsonrpcService,
    private appleWallet: AppleWalletService,
    private cookiesService: CookiesService,
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient,
    private wpJsonService: WpJsonService,
  ) { }



  ngOnInit(): void {
    this.getAccountData();
    this.getTypeDevice();
  }

  getAccountData() {
    const token = this.cookiesService.getItem('token')
    if (!token) {
      this.cookiesService.deleteCookie('token')
      this.deauthorization.emit(true)
      return
    }
    this.loadingBonuses = true;
    this.wpJsonService.getCustomerInfo(environment.systemId, token, environment.icardProxy).subscribe({
      next: (res) => {
        this.userName = res.customer_info.name
        this.accountData = {
          CardNumber: res.customer_info.cards[0]?.Number || '',
          Bonuses: res.customer_info.walletBalances[0].balance
        }
        barcode("#barcode")
          .options({ font: "OCR-B" }) // Will affect all barcodes
          .EAN13(`${this.accountData.CardNumber}`.padStart(12, "0"), { fontSize: 18, textMargin: 0 })
          .render();
        this.loadingBonuses = false;
      },
      error: (err) => {
        console.error('Error: ', err)
      }
    })
  }

  getTypeDevice() {
    const userAgent = window.navigator.userAgent.toLowerCase()
    const ios = /iphone|ipod|ipad/.test(userAgent);
    this.deviceType = ios ? 'ios' : 'android'
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
