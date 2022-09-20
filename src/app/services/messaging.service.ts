import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
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

  updateToken(token: string | null) {
    if (!token) return;
    this.jsonRpcService
      .rpc(
        {
          method: 'updateAdditionalInfo',
          params: [
            {
              'fmc-token': token,
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
      console.log('new message received. ', payload);
      this.currentMessage.next(payload);
    });
  }
}
