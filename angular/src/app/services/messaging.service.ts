import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { JsonrpcService, RpcService } from './jsonrpc.service';

@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);

  constructor(
    private angularFireMessaging: AngularFireMessaging,
    private jsonRpcService: JsonrpcService,
    private messageService: MessageService
  ) {
    this.angularFireMessaging.messages.subscribe((_messaging: any) => {
      _messaging.onMessage = _messaging.onMessage.bind(_messaging);
      _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    });
  }

  async updateToken(token: string | null) {
    if (!token) return;
    const additionalInfo = (await lastValueFrom(
      this.jsonRpcService.rpc({
        method: 'getAdditionalInfo',
        params: []
      }, RpcService.authService, true)
      )).data
      let tokens: string[] = []
      if (typeof additionalInfo['fmc-token'] === 'string') {
        tokens.push(additionalInfo['fmc-token'], token)
      } else if (typeof additionalInfo['fmc-token'] === 'object') {
        tokens = [...additionalInfo['fmc-token'], token]
      } else {
        tokens = [token]
      }
    this.jsonRpcService
      .rpc(
        {
          method: 'updateAdditionalInfo',
          params: [
            {
              'fmc-token': tokens,
            },
          ],
        },
        RpcService.authService,
        true
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'custom',
            summary: 'Спасибо за подписку!',
          });
        },
        error: (err) => {
          console.error('Error: ', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Произошла ошибка, попробуйте позже',
          });
        },
      });
  }

  requestPermission() {
    try {
      this.angularFireMessaging.requestToken.subscribe({
        next: (token) => {
          this.updateToken(token);
        },
        error: (e) => console.error(e),
      });
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe((payload: any) => {
      this.currentMessage.next(payload);
    });
  }
}
