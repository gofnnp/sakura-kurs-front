import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeliveryData, DeliveryType, UserData } from 'src/app/interface/data';
import { paymentMethods } from "../../app.constants";
import { OrderService } from "../../services/order.service";
import { AutocompleteService } from "../../services/autocomplete.service";
import { StreetValidator } from "../../validators/street.validator";
import { CartService } from 'src/app/services/cart.service';
import { environment } from "../../../environments/environment";
import { MessageService } from "primeng/api";
import { WpJsonService } from "../../services/wp-json.service";
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-user-data-order',
  templateUrl: './user-data-order.component.html',
  styleUrls: ['./user-data-order.component.scss']
})
export class UserDataOrderComponent implements OnInit {

  @Output() orderSubmitted = new EventEmitter<void>();
  readonly cities = environment.cities;
  readonly paymentMethods = paymentMethods;
  public loading = false;
  public hasError = false;
  public mainFormGroup!: FormGroup;
  public deliveryTypes: DeliveryType[] = [];
  public minDate!: Date;
  public new_street!: string | null;
  public street!: string;
  public new_house!: string | null;
  public checkAddress: boolean = true;
  public showMyMessage: boolean = false;

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
    paymentMethod: paymentMethods[0],
    comment: '',
    persons: 1,
  };

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private autoCompleteService: AutocompleteService,
    private streetValidator: StreetValidator,
    private cartService: CartService,
    private messageService: MessageService,
    private wpJsonService: WpJsonService,
  ) {
  }

  ngOnInit(): void {
    this.minDate = new Date();
    this._createMainForm();
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
        Object.keys(mainControls).forEach(controlName => {
          childGroupControls[controlName].markAsTouched();
        });
      });
      return;
    }
    this.submitOrder();
  }

  submitOrder(): void {
    this.loading = true;
    const userData: UserData = this.mainFormGroup.controls['userDataForm'].value;
    userData.phone = this.userData.phone;
    this.orderService.setUserData(userData);
    this.orderService.setDeliveryData(this.mainFormGroup.controls['deliveryDataForm'].value);
    this.orderService.submit().subscribe({
      next: (_) => {
        this.loading = false;
        this.cartService.clearCart();
        this.orderSubmitted.next();
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
    const order = await this.orderService.getOrder(true);
    this.userData = Object.assign({}, this.userData, order.userData);
    this.userData.city = this.cities[0];
    this.userData.phone = order.phone;
    // await this.autoCompleteService.setCity(this.userData.city);
    return this.fb.group({
      phone: [this.userData.phone],
      first_name: [this.userData.first_name, [Validators.required, Validators.minLength(2), Validators.maxLength(255),]],
      // last_name: [this.userData.last_name, [Validators.required, Validators.minLength(2), Validators.maxLength(255),]],
      street: [this.userData.street, [Validators.required, Validators.minLength(2), Validators.maxLength(255),]],
      house: [this.userData.house, [Validators.required, Validators.maxLength(10), Validators.pattern('^\\d+[-|\\d]+\\d+$|^\\d*$')]],
      flat: [this.userData.flat, []],
      // city: [this.userData.city, [Validators.required]],
    });
  }

  private async _createDeliveryDataForm(): Promise<FormGroup> {
    this.deliveryTypes = [
      {
        "cost": 100,
        "title": "Доставка",
        "id": 11,
        "type": "delivery"
      },
      {
        "cost": 0,
        "title": "Самовывоз",
        "id": 16,
        "type": "self_delivery"
      }
    ];
    this.deliverData.deliveryType = this.deliveryTypes[0];
    return this.fb.group({
      // deliveryDate: [this.deliverData.deliveryDate, []],
      deliveryType: [this.deliverData.deliveryType, [Validators.required]],
      paymentMethod: [this.deliverData.paymentMethod, [Validators.required]],
      // persons: [this.deliverData.persons, [Validators.required, Validators.minLength(2), Validators.maxLength(255),]],
      comment: [this.deliverData.comment, [Validators.maxLength(255),]],
    });
  }
}

