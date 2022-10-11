import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppleWalletService {
    private url: string = environment.appleWalletEndpoint;
  constructor(
    private http: HttpClient,
  ) {}

  generateCard(token: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', environment.appleWalletSecret);
    const options = {
      headers: headers,
    };
    return this.http.get(`${this.url}/client/${environment.clientName}/passUrl/${token}`, options)
  }
}
