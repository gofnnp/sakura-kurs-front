import { Component, ComponentRef, ElementRef, EmbeddedViewRef, OnInit, Renderer2, ViewContainerRef } from "@angular/core";
import { AngularFireMessaging } from "@angular/fire/compat/messaging";
import { ActivatedRoute } from "@angular/router";
import { CardComponent } from "src/app/components/card/card.component";
import { AccountComponent } from "../account/account.component";
import {MessageService} from 'primeng/api';


@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  private cardComponent!: ComponentRef<CardComponent>;
  private accountComponent!: ComponentRef<AccountComponent>;
  public messagingToken!: string | null;
  public deferredPrompt: any;
  public isPermissionNotifications: boolean = false;
  public token = ''

  constructor(
      private route: ActivatedRoute,
      private viewContainerRef: ViewContainerRef,
      private afMessaging: AngularFireMessaging,
      public el: ElementRef,
      public renderer: Renderer2,
      private messageService: MessageService
  ) {
    renderer.listen('window', 'appinstalled', (evt) => {
      console.log('INSTALLED!!!')
    })
    renderer.listen('window', 'beforeinstallprompt', (e) => {
      e.preventDefault()
      this.deferredPrompt = e
    })
    route.queryParams.subscribe( (params) => {
      console.log('####: ', params)
      if (params['token']) this.token = params['token']
    });
  }

  ngOnInit(): void {    
    this.appendAccount();
    this.checkRequestPermission()
  }

  downloadPWA() {
    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice.then((res: any) => {
      if (res.outcome === 'accepted') {
        this.messageService.add({severity:'success', summary:'Спасибо за установку!'});
        console.log('User Accepted!!!')
      }
      this.deferredPrompt = null;
    })
  }

  checkRequestPermission() {
    this.isPermissionNotifications = Notification.permission !== 'granted' ? false : true
  }

  requestPermission() {
    if (!('serviceWorker' in navigator)) { 
      this.messageService.add({severity:'error', summary:'Не поддерживается в Вашем браузере!'});
      return; 
    }
    
    if (!('PushManager' in window)) { 
      // Браузер не поддерживает push-уведомления.
      this.messageService.add({severity:'error', summary:'Не поддерживается в Вашем браузере!'});
      return; 
    }
    this.afMessaging.requestPermission.subscribe({
      next: () => {
        console.log('Permission granted! Save to the server!')
      },
      error: e => console.error(e)
    })

    this.afMessaging.requestToken.subscribe({
      next: (token) => {
        this.messagingToken = token;
        if (this.messagingToken) {
          this.messageService.add({severity:'success', summary:'Спасибо за подписку!'});
          this.isPermissionNotifications = true;
        }
        console.log(token)
      },
      error: e => console.error(e)
    })
    
  }
  // test function
  copyMessage(val: string | null){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    if (val) selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  appendCard(): void {
    const route = this.route.snapshot.url[0]?.path;
    const element = document.getElementsByClassName('main-container');
    if (!route && element[0]) {
      this.cardComponent = this.viewContainerRef.createComponent(CardComponent);
      const domElem = (this.cardComponent.hostView as EmbeddedViewRef<any>)
        .rootNodes[0] as HTMLElement;
      element[0].appendChild(domElem);
    }
  }

  appendAccount(): void {
    const route = this.route.snapshot.url[0]?.path;
    const element = document.getElementsByClassName('main-container');
    if (element[0]) {
      this.accountComponent = this.viewContainerRef.createComponent(AccountComponent);
      const domElem = (this.accountComponent.hostView as EmbeddedViewRef<any>)
        .rootNodes[0] as HTMLElement;
      element[0].appendChild(domElem);
    }
  }
}