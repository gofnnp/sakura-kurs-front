import { Component, OnInit } from '@angular/core';
import * as barcode from 'jsbarcode';
import { MessageService } from 'primeng/api';
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
    private messageService: MessageService
  ) { }

  async ngOnInit() {
    const accountData = (await lastValueFrom(
      this.jsonrpc.rpc({
        method: 'GetAccounts',
        params: []
      },
      RpcService.bonusService
    )))['Cards'][0]
    this.refUrl += accountData.CardNumber   
    this.loading = false
  }

  share() {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: "Fashion Logica",
        url: this.refUrl
      })
      .then(() => console.log('Successful share'))
      .catch((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Произошла ошибка!',
        });
        console.log('Error sharing:', error)
      });
    }
  }

  copyUrl() {
    navigator.clipboard.writeText(this.refUrl)
    .then(() => {
      this.messageService.add({
        severity: 'custom',
        summary: 'Ссылка скопирована!',
      });
    })
    .catch(err => {
      this.messageService.add({
        severity: 'error',
        summary: 'Произошла ошибка!',
      });
    });
  }

}
