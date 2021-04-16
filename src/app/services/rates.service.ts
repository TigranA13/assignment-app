import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";

import { environment } from "../../environments/environment";

interface IRates {
  base: string,
  rates: {},
  date: string,
}

@Injectable({
  providedIn: 'root'
})
export class RatesService {
  constructor(private http: HttpClient) {}

  getRates(): Observable<IRates> {
    let params = new HttpParams()
      .set('access_key', environment.apiKey);

    return this.http.get<IRates>('http://api.exchangeratesapi.io/v1/latest', { params });
  }
}
