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
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';
import { MessageService } from 'primeng/api';

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
    private api: ApiService,
    private messageService: MessageService,
    private _snackBar: MatSnackBar
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
    this.api.getUser().subscribe({
      next: (value) => {
        this.accountData = value
        this.userName = value.name
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Произошла ошибка! Попробуйте позже'
        })
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
