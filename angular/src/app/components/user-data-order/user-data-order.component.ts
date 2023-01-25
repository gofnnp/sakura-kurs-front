import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeliveryData, DeliveryType, PaymentMethod, UserData } from 'src/app/interface/data';
import { paymentMethods } from "../../app.constants";
import { OrderService } from "../../services/order.service";
import { AutocompleteService } from "../../services/autocomplete.service";
import { StreetValidator } from "../../validators/street.validator";
import { CartService } from 'src/app/services/cart.service';
import { environment } from "../../../environments/environment";
import { MessageService } from "primeng/api";
import { WpJsonService } from "../../services/wp-json.service";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CookiesService } from 'src/app/services/cookies.service';
import moment from 'moment';
import { Order } from 'src/app/models/order';
import { Store } from '@ngrx/store';
import * as fromConfig from '../../state/config/config.reducer'
import { lastValueFrom } from 'rxjs';



@Component({
  selector: 'app-user-data-order',
  templateUrl: './user-data-order.component.html',
  styleUrls: ['./user-data-order.component.scss']
})
export class UserDataOrderComponent implements OnInit {

  @Output() orderSubmitted = new EventEmitter<number>();
  readonly cities = environment.cities;
  public paymentMethods!: PaymentMethod[];
  public loading = false;
  public hasError = false;
  public mainFormGroup!: FormGroup;
  public deliveryTypes: DeliveryType[] = [];
  public new_street!: string | null;
  public street!: string;
  public new_house!: string | null;
  public checkAddress: boolean = true;
  public showMyMessage: boolean = false;
  public order!: Order;
  public showAuthoriztion = false;

  public userData: UserData = {
    first_name: null,
    last_name: null,
    street: null,
    house: null,
    flat: null,
    city: this.cities[0],
    phone: null,
  };
  public deliverData: DeliveryData = {
    deliveryDate: null,
    deliveryType: null,
    paymentMethod: null,
    comment: '',
    persons: 1,
    orderid: 0
  };
  public terminalList!: any;
  public selectedTerminal!: any;

  checkoutConfig$ = this.store.select(fromConfig.selectCheckout);
  checkoutConfig!: any;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private autoCompleteService: AutocompleteService,
    private streetValidator: StreetValidator,
    private cartService: CartService,
    private messageService: MessageService,
    private wpJsonService: WpJsonService,
    private http: HttpClient,
    private cookiesService: CookiesService,
    private store: Store
  ) { }

  async ngOnInit() {
    this.checkAuthorization(true)
    this._createMainForm();
    this.getTerminalList();
    this.selectedTerminal = JSON.parse(this.cookiesService.getItem('selectedTerminal') || '')
    this.checkoutConfig$.subscribe({
      next: (value: any) => {
        this.checkoutConfig = value
      }
    })
    this.deliverData.deliveryDate = moment().add(this.checkoutConfig?.timeDelivery?.changeTime?.defaultValue || 0, 'minutes').toDate()
    this.paymentMethods = this.checkoutConfig.payments.values
    this.deliverData.paymentMethod = this.paymentMethods[this.checkoutConfig.payments.default]

  }

  getTerminalList() {
    this.http.get('./assets/terminal_list1.json').subscribe({
      next: (value) => {
        this.terminalList = value
      },
      error: (err) => {
        console.error(err);

      }
    })
  }

  checkAuthorization(showAuthoriztion: boolean, forced = false) {
    if (!this.getToken() || forced) {
      this.showAuthoriztion = showAuthoriztion
    }
  }

  getToken(): string | void {
    return this.cookiesService.getItem('token');
  }

  phoneConfirmed() {
    this.showAuthoriztion = false
    this.checkAuthorization(true)
  }

  changeDeliveryType(event: any) {
    this.deliverData.deliveryType = event.value;
    if (this.deliverData.deliveryType?.title) {
      this.changeValidators(this.deliverData.deliveryType.title)
    }
  }

  changeValidators(title: string) {
    const comment = this.mainFormGroup.controls['deliveryDataForm'].value.comment;
    const streetValidators = title === 'Доставка' ? [Validators.required, Validators.minLength(2), Validators.maxLength(255),] : []
    const houseValidators = title === 'Доставка' ? [Validators.required, Validators.maxLength(10),] : []
    const userDataForm = this.fb.group({
      phone: [this.userData.phone],
      first_name: [this.userData.first_name, [Validators.required, Validators.minLength(2), Validators.maxLength(255),]],
      // last_name: [this.userData.last_name, [Validators.required, Validators.minLength(2), Validators.maxLength(255),]],
      street: [this.userData.street, streetValidators],
      house: [this.userData.house, houseValidators],
      flat: [this.userData.flat, []],
      // city: [this.userData.city, [Validators.required]],
    });
    const deliveryDataForm = this.fb.group({
      deliveryDate: [this.deliverData.deliveryDate, []],
      deliveryType: [this.deliverData.deliveryType, [Validators.required]],
      paymentMethod: [this.deliverData.paymentMethod, [Validators.required]],
      // persons: [this.deliverData.persons, [Validators.required, Validators.minLength(2), Validators.maxLength(255),]],
      comment: [comment, [Validators.maxLength(255),]],
    });

    this.mainFormGroup = this.fb.group({
      userDataForm,
      deliveryDataForm,
    });
  }

  submit(): void {
    const mainControls = this.mainFormGroup.controls;
    if (this.mainFormGroup.invalid) {
      Object.keys(mainControls).forEach(groupName => {
        const childGroupControls = (mainControls[groupName] as FormGroup).controls;
        Object.keys(childGroupControls).forEach(controlName => {
          childGroupControls[controlName].markAsTouched();
        });
      });
      this.messageService.add({
        severity: 'error',
        summary: 'Заполните обязательные поля',
      })
      return;
    }
    this.submitOrder();
  }

  async submitOrder() {
    this.loading = true;
    const userData: UserData = this.mainFormGroup.controls['userDataForm'].getRawValue();
    userData.phone = this.userData.phone;
    const deliveryData = this.mainFormGroup.controls['deliveryDataForm'].getRawValue()
    deliveryData.orderid = Math.floor(Math.random() * (10 ** 12))
    this.orderService.setUserData(userData);
    this.orderService.setDeliveryData(deliveryData);
    
    this.orderService.submit().subscribe({
      next: (_) => {
        this.loading = false;
        this.cartService.clearCart();
        this.orderSubmitted.next(deliveryData.orderid);
      },
      error: () => {
        this.loading = false;
        this.hasError = true;
      }
    })
  }

  private async _createMainForm(): Promise<void> {
    try {
      this.loading = true;
      const userDataForm = await this._createUserDataForm();
      const deliveryDataForm = await this._createDeliveryDataForm();
      this.mainFormGroup = this.fb.group({
        userDataForm,
        deliveryDataForm,
      });
      this.loading = false;
    }
    catch (e) {
      console.error('Erroe: ', e);

      this.messageService.add({
        severity: 'error',
        summary: 'Произошла ошибка',
      })
    }
  }

  private async _createUserDataForm(): Promise<FormGroup> {
    this.order = await this.orderService.getOrder(true);
    this.userData = Object.assign({}, this.userData, this.order.userData);
    this.userData.city = this.cities[0];
    this.userData.phone = this.order.phone;
    // await this.autoCompleteService.setCity(this.userData.city);
    const isSelfDelivery = this.deliverData.deliveryType?.type === "self_delivery"
    return this.fb.group({
      phone: [this.userData.phone],
      first_name: [this.userData.first_name, [Validators.required, Validators.minLength(2), Validators.maxLength(255),]],
      // last_name: [this.userData.last_name, [Validators.required, Validators.minLength(2), Validators.maxLength(255),]],
      street: [{ value: this.userData.street, disabled: isSelfDelivery }, isSelfDelivery ?? [Validators.required, Validators.minLength(2), Validators.maxLength(255),]],
      house: [{ value: this.userData.house, disabled: isSelfDelivery }, isSelfDelivery ?? [Validators.required, Validators.maxLength(10), Validators.pattern('^\\d+[-|\\d]+\\d+$|^\\d*$')]],
      flat: [this.userData.flat, []],
      // city: [this.userData.city, [Validators.required]],
    });
  }

  private async _createDeliveryDataForm(): Promise<FormGroup> {
    this.deliveryTypes = this.checkoutConfig.delivery.values;
    this.deliverData.deliveryType = this.deliveryTypes[this.checkoutConfig.delivery.default];
    return this.fb.group({
      deliveryDate: [{ value: this.deliverData.deliveryDate, disabled: this.checkoutConfig.timeDelivery.changeTime.disabled }, []],
      deliveryType: [{ value: this.deliverData.deliveryType, disabled: this.checkoutConfig.delivery.disabled }, [Validators.required]],
      paymentMethod: [{ value: this.deliverData.paymentMethod, disabled: this.checkoutConfig.payments.disabled }, [Validators.required]],
      persons: [this.deliverData.persons, [Validators.required, Validators.minLength(2), Validators.maxLength(255),]],
      comment: [this.deliverData.comment, [Validators.maxLength(255),]]
    });
  }
}

