import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';

import { LoaderModule } from '../loader/loader.module';

@NgModule({
  declarations: [
    EmployeesComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    EmployeesRoutingModule,
    LoaderModule
  ]
})
export class EmployeesModule { }
