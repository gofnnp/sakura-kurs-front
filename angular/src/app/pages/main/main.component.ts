import {
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  OnInit,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ActivatedRoute } from '@angular/router';
import { CardComponent } from 'src/app/components/card/card.component';
import { AccountComponent } from '../account/account.component';
import { MessageService } from 'primeng/api';
import { MessagingService } from 'src/app/services/messaging.service';
import { CookiesService } from 'src/app/services/cookies.service';
import { Store } from '@ngrx/store';
import * as ConfigActions from '../../state/config/config.actions'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  private cardComponent!: ComponentRef<CardComponent>;
  private accountComponent!: ComponentRef<AccountComponent>;
  public messagingToken!: string | null;
  public deferredPrompt: any;
  public isPermissionNotifications: boolean = false;
  public token = '';
  public message: any;

  constructor(
    private route: ActivatedRoute,
    private viewContainerRef: ViewContainerRef,
    private afMessaging: AngularFireMessaging,
    public el: ElementRef,
    public renderer: Renderer2,
    private messageService: MessageService,
    private messagingService: MessagingService,
    private cookiesService: CookiesService,
    private store: Store
  ) {
    renderer.listen('window', 'appinstalled', (evt) => {
      console.log('INSTALLED!!!');
    });
    renderer.listen('window', 'beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });
    route.queryParams.subscribe((params) => {
      if (params['token']) {
        this.token = params['token']
      } else {
        const token = this.cookiesService.getItem('token')
        this.token = token ? token : '';
      };
    });
    
  }

  ngOnInit(): void {
    this.appendAccount();
    // this.store.dispatch(ConfigActions.getConfig());
    // this.checkRequestPermission()
  }

  downloadPWA() {
    if (!this.deferredPrompt) {
      this.messageService.add({
        severity: 'error',
        summary: 'Не поддерживается в Вашем браузере!',
      });
      return;
    }
    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice.then((res: any) => {
      if (res.outcome === 'accepted') {
        this.messageService.add({
          severity: 'custom',
          summary: 'Спасибо за установку!',
        });
        console.log('User Accepted!!!');
      }
      this.deferredPrompt = null;
    });
  }

  checkRequestPermission() {
    this.isPermissionNotifications =
      Notification.permission !== 'granted' ? false : true;
  }

  requestPermission() {
    if ('safari' in window) {
      console.log('safari');
      
      // var permissionData = window.safari.pushNotification.permission('web.com.example.domain');
      // $scope.checkRemotePermission(permissionData);
    } else {
      //FIREBASE HERE
      this.messagingService.requestPermission();
      this.messagingService.receiveMessage();
      this.message = this.messagingService.currentMessage;
    }
  }
  // test function
  copyMessage(val: string | null) {
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
      this.accountComponent =
        this.viewContainerRef.createComponent(AccountComponent);
      const domElem = (this.accountComponent.hostView as EmbeddedViewRef<any>)
        .rootNodes[0] as HTMLElement;
      element[0].appendChild(domElem);
    }
  }
}
