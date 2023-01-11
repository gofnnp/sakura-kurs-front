import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartModifier, Modifier } from 'src/app/interface/data';
import { CartProduct } from 'src/app/models/cart-product';

@Component({
  selector: 'app-option[option][modifier][product]',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})
export class OptionComponent implements OnInit {
  @Input() option!: Modifier
  @Input() modifier!: CartModifier;
  @Input() product!: CartProduct;

  constructor() { }

  ngOnInit(): void {
  }

}
