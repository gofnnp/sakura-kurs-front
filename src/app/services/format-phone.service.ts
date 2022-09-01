import { Injectable } from '@angular/core';
import { AsYouTypeFormatter } from 'google-libphonenumber';

@Injectable({
  providedIn: 'root'
})
export class FormatPhoneService {

  constructor() { }
  formatPhoneNumber(phoneNumber: string): string{
    const formatter = new AsYouTypeFormatter('RU');
    if (!phoneNumber || phoneNumber.length < 2){
      return '+7';
    }
    else{
      let formattedNumber = '';
      phoneNumber = phoneNumber.replace(/[^\d]/g, '');
      phoneNumber = '+' + phoneNumber;
      for (let i = 0; i <  phoneNumber.length; i++) {
        if (i === phoneNumber.length - 1){
          formattedNumber = formatter.inputDigit(phoneNumber.charAt(i)).trim();
        }
        else {
          formatter.inputDigit(phoneNumber.charAt(i));
        }
      }
      formatter.clear();
      return formattedNumber;
    }
  }
}
