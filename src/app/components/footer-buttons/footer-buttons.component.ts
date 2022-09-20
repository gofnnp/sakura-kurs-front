import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-footer-buttons',
  templateUrl: './footer-buttons.component.html',
  styleUrls: ['./footer-buttons.component.scss']
})
export class FooterButtonsComponent implements OnInit {
  @Input() deferredPrompt: any;
  @Input() token!: string;
  @Input() isPermissionNotifications!: boolean;
  @Output() downloadingPWA = new EventEmitter<null>();
  @Output() requestingPermission = new EventEmitter<null>();
  public deviceType: 'ios' | 'android' | null = null;

  constructor(
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getTypeDevice()
  }

  getTypeDevice() {
    const userAgent = window.navigator.userAgent.toLowerCase()
    const ios = /iphone|ipod|ipad/.test( userAgent );
    this.deviceType = ios ? 'ios' : 'android'
  }

  downloadPWA() {
    if (this.deviceType === 'ios') {
      this.messageService.add({
        severity: 'custom',
        summary: "Для установки нажмите на кнопку поделиться в Вашем браузере и выберите пункт 'Добавить на главный экран'",
      });
      return
    }
    this.downloadingPWA.emit(null)
  }

  requestPermission() {
    this.requestingPermission.emit(null)
  }
}
