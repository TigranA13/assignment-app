import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private http: HttpClient) { }

  // get employees data
  getEmployeesData(): Observable<any> {
    return this.http.get('https://randomuser.me/api?results=25 ');
  }
}

