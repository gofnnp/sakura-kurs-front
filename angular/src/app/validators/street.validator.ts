import { Injectable } from '@angular/core';
import {AbstractControl, ValidationErrors, AsyncValidator} from '@angular/forms';
import {AutocompleteService} from "../services/autocomplete.service";



@Injectable({ providedIn: 'root' })
export class StreetValidator implements AsyncValidator {
  constructor(private autocompleteService: AutocompleteService) {}

  async validate(
    control: AbstractControl
  ): Promise<ValidationErrors | null> {
    try{
      const streets = await this.autocompleteService.queryStreet(control.value);
      if(streets.includes(control.value)){
        return null;
      }
      return { validStreet: false }
    }
    catch (e){
      return { validStreet: false }
    }
  }
}
