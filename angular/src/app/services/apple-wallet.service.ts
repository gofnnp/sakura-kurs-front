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

  generateCard(token: string, user_id: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', environment.appleWalletSecret);
    const options = {
      headers: headers,
    };
    return this.http.get(`${this.url}/client/${environment.clientName}/passUrl/${user_id}/token/${token}`, options)
  }

  reloadCard(user_id:string) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', environment.appleWalletSecret);
    const options = {
      headers: headers,
    };
    const body = {
      text: '',
      isUpdateCard: true
    }
    return this.http.post(`${this.url}/apns/api/sendNotification/${user_id}`, options)
  }
}
