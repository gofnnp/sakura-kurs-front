import { Injectable } from '@angular/core';
// import { AngularFireDatabase } from '@angular/fire/database';
// import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);

  constructor(
    // private angularFireDB: AngularFireDatabase,
    // private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging
  ) {
    this.angularFireMessaging.messages.subscribe((_messaging: any) => {
      _messaging.onMessage = _messaging.onMessage.bind(_messaging);
      _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    });
  }

  /**
   * update token in firebase database
   *
   * @param userId userId as a key
   * @param token token as a value
   */

  //   ОБНОВИТЬ/ДОБАВИТЬ ТОКЕН В БД

  //   updateToken(userId, token) {
  //     // we can change this function to request our backend service
  //     this.angularFireAuth.authState.pipe(take(1)).subscribe(
  //       () => {
  //         const data = {};
  //         data[userId] = token
  //         this.angularFireDB.object('fcmTokens/').update(data)
  //       })
  //   }

  /**
   * request permission for notification from firebase cloud messaging
   *
   * @param userId userId
   */
  requestPermission(userId: string) {
    this.angularFireMessaging.requestToken.subscribe({
      next: (token) => {
        //   this.messagingToken = token;
        //   if (this.messagingToken) {
        //     this.messageService.add({severity:'success', summary:'Спасибо за подписку!'});
        //     this.isPermissionNotifications = true;
        //   }
        console.log(token);
      },
      error: (e) => console.error(e),
    });
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
