import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CookiesService } from './cookies.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { tap } from 'lodash';
import { Product } from '../interface/data';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private url = environment.sakuraApi;

  constructor(
    private cookiesService: CookiesService,
    private http: HttpClient
  ) {}

  signUp(
    email: string,
    password: string,
    name: string,
    secondName: string = 'Не указано'
  ) {
    return this._request('auth/signup', 'POST', {
      email,
      password,
      name,
      secondName,
    });
  }

  signIn(email: string, password: string) {
    return this._request('auth/signin', 'POST', {
      email,
      password,
    });
  }

  getProductGroups() {
    return this._request('product-groups', 'GET', null);
  }

  getProducts() {
    return this._request('products', 'GET', null);
  }

  getUsers() {
    return this._request('users', 'GET', null, true);
  }

  getUser() {
    return this._request('user', 'GET', null, true).pipe(
      map((value: any) => {
        return value.values[0];
      })
    );
  }

  getAllOrders() {
    return this._request('all-orders', 'GET', null, true);
  }

  getUserOrders() {
    return this._request('user-orders', 'GET', null, true);
  }
  
  addOrder(products: Product[]) {
    return this._request('add-order', 'POST', {
      products
    }, true);
  }

  getStatuses() {
    return this._request('statuses', 'GET', null, true);
  }

  changeOrderStatus(orderId: number, statusId: number) {
    return this._request('change-status-order', 'POST', {
      orderId,
      statusId
    }, true);
  }

  _request(
    path: string,
    method: string,
    body?: any,
    auth = false
  ): Observable<any> {
    const token = decodeURI(this.cookiesService.getItem('token') ?? '');
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    if (auth) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const options = {
      headers,
      body,
    };

    return this.http.request(method, this.url + path, options);
  }
}
