import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { CartModifier, Modifier } from '../interface/data';
import { CartProduct } from '../models/cart-product';

@Directive({
  selector: '[appChangeQuantityOption]',
})
export class ChangeQuantityOptionDirective implements OnInit {
  @Input() option!: Modifier;
  @Input() modifier!: CartModifier;
  @Input() product!: CartProduct;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.option.quantity = this.option.restrictions.byDefault;

    if (!this.modifier.lastChangeOption && this.option.restrictions.byDefault) {
      this.modifier.lastChangeOption = this.option.idLocal;
    }
  }

  @HostListener('click') onOptionClick() {
    this.changeQuantity({ option: this.option, modifier: this.modifier });
  }

  changeQuantity({
    option,
    modifier,
  }: {
    option: Modifier;
    modifier: CartModifier;
  }): void {
    if (!option.quantity && option.quantity !== 0) {
      return;
    }
    const quantity = option.quantity;
    const allQuantity = modifier.allQuantity;
    const maxOptionQ = option.restrictions.maxQuantity;
    const minOptionQ = option.restrictions.minQuantity;
    const maxModifierQ = modifier.restrictions.maxQuantity;
    const minModifierQ = modifier.restrictions.minQuantity;
    const plusCondition =
      (quantity < maxOptionQ && allQuantity < maxModifierQ) ||
      (maxOptionQ === 0 && (allQuantity < maxModifierQ || maxModifierQ === 0));

    // if (!plusCondition && quantity > minOptionQ && allQuantity > minModifierQ) {
    //   this.product.decrementOption(modifier.idLocal, option.idLocal);
    // }
    // if (allQuantity === maxModifierQ && modifier.lastChangeOption) {
    //   this.product.decrementOption(modifier.idLocal, modifier.lastChangeOption);
    //   this.changeQuantity({ option, modifier });
    // }
    // if (plusCondition) {
    //   this.product.incrementOption(modifier.idLocal, option.idLocal);
    //   modifier.lastChangeOption = option.idLocal;
    // }
  }
}
