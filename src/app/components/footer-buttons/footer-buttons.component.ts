import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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

  constructor(

  ) { }

  ngOnInit(): void {
  }

  downloadPWA() {
    this.downloadingPWA.emit(null)
  }

  requestPermission() {
    this.requestingPermission.emit(null)
  }
}
