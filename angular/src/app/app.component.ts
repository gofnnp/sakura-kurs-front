import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PrimeNGConfig } from 'primeng/api';
import * as ConfigActions from './state/config/config.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Sakura';

  constructor(private primengConfig: PrimeNGConfig, private store: Store) {}

  ngOnInit() {
    this.primengConfig.ripple = false;
    this.store.dispatch(ConfigActions.getConfig());
  }
}
