import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

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
import { RefSystemComponent } from './pages/account/ref-system/ref-system.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ShareButtonsModule   } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { MessagingService } from './services/messaging.service';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProductsComponent } from './pages/products/products.component';
import { CartComponent } from './pages/cart/cart.component';
import {ListboxModule} from 'primeng/listbox';
import { ProductModalComponent } from './components/product-modal/product-modal.component';
import { CheckboxGroupComponent } from './components/checkbox-group/checkbox-group.component';
import { TreeSelectModule } from 'primeng/treeselect';
import { UserDataOrderComponent } from './components/user-data-order/user-data-order.component';
import {DropdownModule} from "primeng/dropdown";
import {SelectButtonModule} from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import {MatIconModule} from '@angular/material/icon';
import { InfoComponent } from './pages/info/info.component';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { StoreModule } from '@ngrx/store';
import { configReducer } from './state/config/config.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ConfigEffects } from './state/config/config.effects';
import {PaginatorModule} from 'primeng/paginator';
import {InputTextModule} from 'primeng/inputtext';
import { ChangeQuantityComponent } from './components/change-quantity/change-quantity.component';
import { MenuComponent } from './components/menu/menu.component';
import { SidebarModule } from 'primeng/sidebar';
import {RippleModule} from 'primeng/ripple';
import {MatTabsModule} from '@angular/material/tabs';
import { ModifierComponent } from './components/modifier/modifier.component';
import { OptionComponent } from './components/option/option.component';
import { ChangeQuantityOptionDirective } from './directives/change-quantity-option.directive';

const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  // { path: 'cart', component: CartComponent },
  { path: 'account', component: AccountComponent },
  { path: '**', component: NotFoundComponent }
];

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
    RefSystemComponent,
    NotFoundComponent,
    ProductsComponent,
    CartComponent,
    ProductModalComponent,
    CheckboxGroupComponent,
    UserDataOrderComponent,
    InfoComponent,
    ChangeQuantityComponent,
    MenuComponent,
    ModifierComponent,
    OptionComponent,
    ChangeQuantityOptionDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
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
    ReactiveFormsModule,
    QRCodeModule,
    ShareButtonsModule.withConfig({
      debug: true
    }),
    ShareIconsModule,
    ListboxModule,
    TreeSelectModule,
    DropdownModule,
    SelectButtonModule,
    CalendarModule,
    MatIconModule,
    MdbCarouselModule,
    StoreModule.forRoot({config: configReducer}),
    EffectsModule.forRoot([ConfigEffects]),
    PaginatorModule,
    InputTextModule,
    SidebarModule,
    RippleModule,
    MatTabsModule
  ],
  providers: [DialogService, MessageService, MessagingService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
