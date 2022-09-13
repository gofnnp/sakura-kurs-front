import { Component, OnInit } from '@angular/core';
import * as barcode from 'jsbarcode';
import { lastValueFrom } from 'rxjs';
import { JsonrpcService, RpcService } from 'src/app/services/jsonrpc.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ref-system',
  templateUrl: './ref-system.component.html',
  styleUrls: ['./ref-system.component.scss']
})
export class RefSystemComponent implements OnInit {
  public refUrl: string = `${environment.defaultUrl}/?refCardNumber=`
  public loading: boolean = true;

  constructor(
    private jsonrpc: JsonrpcService,
  ) { }

  async ngOnInit() {
    const accountData = (await lastValueFrom(
      this.jsonrpc.rpc({
        method: 'GetAccounts',
        params: []
      },
      RpcService.bonusService
    )))['Cards'][0]
    this.loading = false
    this.refUrl += accountData.CardNumber    
  }

}
