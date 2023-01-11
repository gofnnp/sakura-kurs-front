import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartModifier, Modifier } from 'src/app/interface/data';
import { CartProduct } from 'src/app/models/cart-product';

@Component({
  selector: 'app-modifier[modifier][product]',
  templateUrl: './modifier.component.html',
  styleUrls: ['./modifier.component.scss']
})
export class ModifierComponent implements OnInit {
  @Input() product!: CartProduct
  @Input() modifier!: CartModifier

  constructor() { }

  ngOnInit(): void {
  }

}
