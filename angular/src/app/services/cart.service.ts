import {Injectable} from '@angular/core';
import {CookiesService} from "./cookies.service";
import {Cart} from "../interface/data";
import {isEqual} from 'lodash/fp';
import {CartProduct} from "../models/cart-product";
import {Subject} from "rxjs";
import { update } from 'lodash';
import { WpJsonService } from './wp-json.service';

export enum ProductAmountAction {
  increment,
  decrement,
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private cookieService: CookiesService,
    private wpJsonService: WpJsonService,
    ) { }

  private cart!: Cart;

  public cartCount$ = new Subject<number>();


  getCart(){
    return this._getCartProducts();
  }


  addToCart(product: CartProduct): void{
    const cart = this._getCartProducts();
    
    cart.products = cart.products ?? [];
    const sameProduct = cart.products.find((value) => value.id === product.id && isEqual(value.modifiers, product.modifiers));
    if(sameProduct){
      sameProduct.amount ++;
    }
    else {
      cart.products.push(product);
      this.cartCount$.next(cart.products.length);
    }
    this.cookieService.setCookie('cart', JSON.stringify(cart));
  }

  removeFromCart(guid: string): void{
    const cart = this._getCartProducts();
    if(!cart.products){
      return;
    }
    cart.products = cart.products.filter((value) => value.guid !== guid);
    this.cookieService.setCookie('cart', JSON.stringify(cart));
    this.cartCount$.next(cart.products.length);
  }

  updateProductFromCart(product: CartProduct): void{
    // const cart = this._getCartProducts();
    // if(!cart.products){
    //   return;
    // }
    
    
    // const updateProduct = cart.products.find((value) => Number(value.id) === product.id)
    // if (updateProduct) {
    //   updateProduct.modifiers = JSON.parse(JSON.stringify(product.modifiers))
    // }
    // this.cookieService.setCookie('cart', JSON.stringify(cart));
  }

  changeAmountProduct(productTempId: string,action: ProductAmountAction): void{
    const cart = this._getCartProducts();
    if(!cart.products){
      return;
    }
    const product: CartProduct | undefined = cart.products.find((value) => value.guid === productTempId);
    if(product && action === ProductAmountAction.increment){
      product.amount++
      // product.increment();
    }
    else if(product && action === ProductAmountAction.decrement){
      product.amount--
      // product.decrement();
    }
    this.cookieService.setCookie('cart', JSON.stringify(cart));
    this.cartCount$.next(cart.products.length);
  }

  clearCart(){
    this.cart = {products: []};
    this.cookieService.setCookie('cart', JSON.stringify(this.cart));
    this.cartCount$.next(0);
  }

  _getCartProducts(): Cart{
    if(this.cart){
      return this.cart;
    }
    
    const cartJson = this.cookieService.getItem('cart');
    this.cart = cartJson ? JSON.parse(cartJson) : {products: []};
    return this.cart;
  }

  get cartCount(): number{
    return this._getCartProducts().products.length;
  }
}