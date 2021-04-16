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
    this.subscription = this.currencyTo.valueChanges
      .subscribe(val => {
        this.exchangeValue = 0;
      });
  }

  ngOnInit(): void {
    this.getCurrencies();
  }

  getCurrencies(): void {
    this.loader = true;
    this.ratesService.getRates()
      .pipe(
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
