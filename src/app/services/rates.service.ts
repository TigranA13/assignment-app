import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RatesService {
  constructor(private http: HttpClient) {}

  // get rates data
  getRates(): Observable<any> {
    // get apiKey from environment file and set as query param
    const params = new HttpParams()
      .set('access_key', environment.apiKey);

    return this.http.get('http://api.exchangeratesapi.io/v1/latest', { params });
  }
}
