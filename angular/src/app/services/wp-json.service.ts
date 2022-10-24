import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookiesService} from "./cookies.service";
import {Observable} from "rxjs";
import {JsonRpcBody} from "./jsonrpc.service";
import {DeliveryType, AcceptedOrder, Product} from "../interface/data";
import {ActivatedRoute} from "@angular/router";
import {Order} from "../models/order";

export enum Method {

}

@Injectable({
  providedIn: 'root'
})
export class WpJsonService {

  protected readonly api = environment.appWPEndpoint;
  private body!: JsonRpcBody;

  constructor(
    private http: HttpClient,
    private cookiesService: CookiesService,
    private route: ActivatedRoute,
  ) { }

  getDeliveryTypes(): Observable<DeliveryType[]>{
    return this._request('orders/delivery-types', 'GET');
  }

  createOrder(order: any){
    return this._request('orders', 'POST', order);
  }

  getOrders(): Observable<AcceptedOrder[]>{
    return this._request('orders', 'GET', null, true);
  }

  getProductById(id: number): Observable<Product>{
    return this._request(`products/${id}`, 'GET');
  }

  getAllData(): Observable<any> {
    return this._request('nomen_1eb3fb56-3c4c-43b7-9a04-ce532ab7548f.json', 'GET')
  }

  _request(path: string, method: string, body?: any, auth = false): Observable<any> {
    const token = decodeURI(this.cookiesService.getItem('token') ?? '');
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    let urlToken = '';
    if (token && token !== 'undefined' && auth) {
      urlToken = '?token=' +  token;
    }
    this.body = body;
    const options = {
      headers: headers,
      body: this.body,
    };

    const url = environment.production ? window.location.origin + '/' : this.api

    return this.http
      .request( method, url + path + urlToken, options);
  }
}
