import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  showMenu() {
    const menu = document.getElementsByClassName('main-menu-container')
    if (menu[0].getAttribute('isShow') === 'true') {
      menu[0].setAttribute('isShow', 'false')
    } else {
      menu[0].setAttribute('isShow', 'true')
    }
  }

}
