import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { RatesService } from '../../services/rates.service';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss']
})
export class ExchangeComponent implements OnInit, OnDestroy {
  loader = false;
  displayedColumns = ['#', 'currency', 'rate'];
  dataSource = [];
  currencies = [];
  base = '';
  date = '';

  currencyFrom = 'EUR';
  currencyTo = new FormControl('USD');
  inputControl = new FormControl('', Validators.compose([
    Validators.required,
    Validators.pattern('^[0-9]*$'),
    Validators.min(0),
  ]));
  exchangeValue = 0;

  private subscription: Subscription;

  constructor(private ratesService: RatesService) {
    // Listen currency selector changes in order to update conversion data
    this.subscription = this.currencyTo.valueChanges
      .subscribe(() => {
        this.exchangeValue = 0;
      });
  }

  ngOnInit(): void {
    this.getCurrencies();
  }

  // get rates data from service and transforming
  getCurrencies(): void {
    this.loader = true;
    this.ratesService.getRates()
      .pipe(
        // transform data end return necessary data
        map(({ base, rates, date }) => {
          const currencies = [];
          const ratesArr = Object.entries(rates).map((res, index) => {
            currencies.push(res[0]);
            return {id: index + 1, currency: res[0], value: res[1]};
          });

          return { base, ratesArr, date, currencies };
        }),
      )
      .subscribe(({ base, ratesArr, date, currencies}) => {
        this.dataSource = ratesArr;
        this.base = base;
        this.date = date;
        this.currencies = currencies;
      }, error => this.loader = false, () => this.loader = false);
  }

  // Converting input amount to selected currency
  convert(): void {
    const inputValue = this.inputControl.value;
    const targetCurrency = this.currencyTo.value;
    const targetRate = this.dataSource.find(val => val.currency === targetCurrency);

    !inputValue && this.inputControl.markAsTouched();

    this.exchangeValue = inputValue * targetRate.value;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
