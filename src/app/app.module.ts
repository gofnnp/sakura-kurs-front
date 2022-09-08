import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CardComponent } from './components/card/card.component';
import {InputMaskModule} from "primeng/inputmask";
import { AuthComponent } from './pages/account/auth/auth.component';
import {ProgressSpinnerModule} from "primeng/progressspinner";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountComponent } from './pages/account/account.component';
import { ExitComponent } from './components/exit/exit.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogService } from 'primeng/dynamicdialog';
import { BonusProgramComponent } from './pages/account/bonus-program/bonus-program.component';
import { OrdersComponent } from './pages/account/orders/orders.component';
import { OrderInfoComponent } from './components/order-info/order-info.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FooterButtonsComponent } from './components/footer-buttons/footer-buttons.component';
import { UserDataComponent } from './pages/account/user-data/user-data.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainComponent,
    CardComponent,
    AuthComponent,
    AccountComponent,
    ExitComponent,
    BonusProgramComponent,
    OrdersComponent,
    OrderInfoComponent,
    FooterButtonsComponent,
    UserDataComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {
          path: '**',
          component: MainComponent
      }
    ]),
    InputMaskModule,
    ProgressSpinnerModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
    ToastModule,
    ReactiveFormsModule
  ],
  providers: [DialogService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
