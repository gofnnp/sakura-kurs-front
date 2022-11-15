import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AllData, Modifier, ModifiersGroup, Option, Product } from 'src/app/interface/data';
import { CartProduct } from 'src/app/models/cart-product';
import { CartService } from 'src/app/services/cart.service';
import { WpJsonService } from 'src/app/services/wp-json.service';

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

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private wpJsonService: WpJsonService,
    private cartService: CartService,
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
    this.cartService.addToCart(this.cartProduct);
    this.dialogRef.close();
  }
}
