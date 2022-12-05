import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AllData, CartModifier, Modifier, ModifiersGroup, Option, Product } from 'src/app/interface/data';
import { CartProduct } from 'src/app/models/cart-product';
import { CartService } from 'src/app/services/cart.service';
import { WpJsonService } from 'src/app/services/wp-json.service';
import { ChangeValue } from '../change-quantity/change-quantity.component';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss']
})
export class ProductModalComponent implements OnInit {
  public product!: Product;
  public allData!: AllData;
  public modifiersGroups!: ModifiersGroup[];
  public modifiers!: Modifier[];
  public cartProduct!: CartProduct;
  public isValidate: boolean = false

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private wpJsonService: WpJsonService,
    private cartService: CartService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.product = this.config.data.product
    this.modifiersGroups = this.config.data.modifiersGroups
    this.modifiers = this.config.data.modifiers
    this.cartProduct = new CartProduct(this.product.id, this.product.name, this.modifiersFilter(), this.modifiers);
  }

  modifiersFilter(): ModifiersGroup[] {
    return this.modifiersGroups.filter((value) => this.product.modifiers_group.includes(value.id))
  }

  optionsFilter(modifierGroup: ModifiersGroup): Modifier[] {
    return this.modifiers.filter((modifier) => modifier.groupId === modifierGroup.id)
  }

  changeQuantity(event: any) {
    const value: ChangeValue = event.value
    const modifierGroup: CartModifier = event.modifierGroup
    const option: Modifier = event.option

    const modifGroup = this.cartProduct.modifiers.find((modifGroup) => modifGroup.idLocal === modifierGroup.idLocal)
    const modifier = modifGroup?.options.find((modifier) => modifier.idLocal == option.idLocal)

    if (!modifier) return
    if (!modifier.quantity && modifier.quantity !== 0) modifier.quantity = modifier.restrictions.byDefault
    if (value.type === 'minus') {
      modifier.quantity -= value.variableQuantity
    } else {
      modifier.quantity += value.variableQuantity
    }
  }



  selectedOptions(modifier: ModifiersGroup): Modifier[] {
    const cartModifier = this.cartProduct.modifiers.find(cartModifier => cartModifier.id === modifier.id)
    if (modifier.restrictions.maxQuantity === 1 && modifier.restrictions.minQuantity === 1) {
      cartModifier?.options.push(this.optionsFilter(modifier)[0])
    }
    return cartModifier?.options ?? [];
  }

  addOption(modifier: ModifiersGroup, option: Modifier) {
    const modif = this.cartProduct.modifiers.find((modif) => modif.id === modifier.id);
    const optionSelectedCartIndex = modif?.options.findIndex((modif) => modif.id === option.id)
    if (modifier.restrictions.maxQuantity === 1 && modifier.restrictions.minQuantity === 1) {
      if (modif?.options) {
        modif.options.length = 0
      }
    } else {
      if ((optionSelectedCartIndex || optionSelectedCartIndex === 0) && optionSelectedCartIndex !== -1) {
        modif?.options.splice(optionSelectedCartIndex, 1)
        return
      }
    }
    modif?.options.push(option)
  }

  getIsShow(element: HTMLDivElement) {
    const isShow = Object.values(element.attributes).find((value) => value.name === 'isshow')?.value
    return isShow === 'true'
  }

  setOptionsView(event: Event, element: HTMLDivElement) {
    if (event) {
      event.preventDefault()
    }
    const isShow = this.getIsShow(element)
    if (isShow) {
      element.setAttribute('isShow', 'false')
      return
    }
    element.setAttribute('isShow', 'true')
  }

  addToCart(event: Event) {
    if (event) {
      event.preventDefault()
    }
    for (let modifiersGroup of this.cartProduct.modifiers) {
      const isValidModifier = modifiersGroup.allQuantity < modifiersGroup.restrictions.minQuantity
      if (isValidModifier) {
        this.messageService.add({
          severity: 'error',
          summary: 'Заполните все модификаторы!'
        });
        this.isValidate = true
        return
      }
    }
    this.cartService.addToCart(this.cartProduct);
    this.dialogRef.close();
  }
}
