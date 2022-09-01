import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookiesService } from './cookies.service';
import { v4 as uuidv4 } from 'uuid';

export enum RpcService{
  authService,
  bonusService
}

export interface JsonRpcBody {
  id: string;
  jsonrpc: string;
  method: string;
  params: any;
}

@Injectable({
  providedIn: 'root'
})

export class JsonrpcService {

  protected readonly api = environment.appAuthEndpoint;
  private jsonrpc = '2.0';
  private body!: JsonRpcBody;

  constructor(
    private http: HttpClient,
    private cookiesService: CookiesService
  ) { }

  rpc(data: {method: string, params: any[]},service: RpcService, auth = false): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json-rpc');
    const options = {
      headers: headers,
    };
    const token = decodeURI(this.cookiesService.getItem('token') ?? '');
    switch (service) {
      case RpcService.authService:
        this.body = {
          id: uuidv4(),
          jsonrpc: this.jsonrpc,
          method: data.method,
          params: auth ? [environment.systemId, token, ...data.params] : [environment.systemId, ...data.params],
        };
        return this.http
          .post(environment.appAuthEndpoint, this.body, options)
          .pipe(map((res: any) => res.result[0]));
      case RpcService.bonusService:
        this.body = {
          id: uuidv4(),
          jsonrpc: this.jsonrpc,
          method: data.method,
          params: [token, ...data.params],
        };
        return this.http
          .post(environment.appBonusEndpoint, this.body, options)
          .pipe(map((res: any) => res.result));
    }

  }

  handleHttpError(error: HttpErrorResponse): void {
    console.log(error.message);
  }
}
