import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/operators";
import {lastValueFrom, Observable} from "rxjs";

enum CompleteType {
  city,
  street,
}

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {

  private city!: string;
  private cityId!: string;
  private query?: string
  private streets: string[] = [];

  constructor(private http: HttpClient) {
  }

  async setCity(city: string | null): Promise<boolean> {
    if (city && this.city != city) {
      this.city = city;
      let headers = new HttpHeaders();
      const cityData = await lastValueFrom(
        this._request(`query=${city}&contentType=city`)
          .pipe(
            map(
              (res: any) => res.result.filter(
                (city: any) => city.id != 'Free'
              )[0]
            ),
          )
      );
      this.cityId = cityData.id;
      return true;
    }
    return false;
  }

  async queryStreet(query: string, city: string | null = null): Promise<string[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    let newCityId = await this.setCity(city);
    if (!this.cityId) {
      return [];
    }
    if (!this.query || this.query !== query || newCityId) {
      this.query = query;
      this.streets = await lastValueFrom(
        this._request(`query=${query}&offset=0&limit=20&cityId=${this.cityId}&contentType=street`)
          .pipe(
            map(
              (res: any) => res.result
                .filter(
                  (street: any) => street.id != 'Free'
                )
                .map(
                  (street: any) => street.name
                )
            )
          )
      );
    }
    return this.streets;
  }

  //jsonp запрос для обхода cors кладра
  _request(params: String): Observable<any> {
    const src = '//kladr-api.ru/api.php?';
    return this.http.jsonp(src + params, 'callback');
  };

}
