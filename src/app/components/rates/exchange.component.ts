import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";

import { map } from "rxjs/operators";

import { RatesService } from "../../services/rates.service";

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss']
})
export class ExchangeComponent implements OnInit, OnDestroy {
  displayedColumns = ['#', 'currency', 'rate'];
  dataSource = [];
  currencies = [];
  base = '';
  date = '';

  currencyFrom = new FormControl();
  currencyTo = new FormControl();
  inputControl = new FormControl();

  constructor(private ratesService: RatesService) {}

  ngOnInit(): void {
    this.currencyFrom.setValue('USD');
    this.currencyTo.setValue('EUR');
    this.getCurrencies();
  }

  getCurrencies(): void {
    this.ratesService.getRates()
      .pipe(
        map(({ base, rates, date })=> {
          const currencies = [];
          const ratesArr = Object.entries(rates).map((res, index) => {
            currencies.push(res[0]);
            return {id: index + 1, currency: res[0], value: res[1]};
          });

          return { base, ratesArr, date, currencies }
        }),
      )
      .subscribe(({ base, ratesArr, date, currencies}) => {
        this.dataSource = ratesArr;
        this.base = base;
        this.date = date;
        this.currencies = currencies;
      });
  }

  convert(): void {
    const currency1 = this.currencyFrom.value;
    const currency2 = this.currencyTo.value;

    console.log(currency1);
    console.log(currency2);
  }

  ngOnDestroy(): void {
  }

}
