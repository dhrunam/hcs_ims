import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { FinancialYearComponent } from './financial-year/financial-year.component';
import { ItemMasterComponent } from './item-master/item-master.component';
import { ItemTypeComponent } from './item-type/item-type.component';
import { UnitComponent } from './unit/unit.component';
import { VendorComponent } from './vendor/vendor.component';
import { BodyComponent } from './body/body.component';
import { DesignationComponent } from './designation/designation.component';
import { DistrictComponent } from './district/district.component';
import { OfficeComponent } from './office/office.component';
import { DivisionComponent } from './division/division.component';
import { LocationComponent } from './location/location.component';
import { AccountheadComponent } from './accounthead/accounthead.component';

@NgModule({
  declarations: [

    FinancialYearComponent,
    ItemMasterComponent,
    ItemTypeComponent,
    UnitComponent,
    VendorComponent,
    BodyComponent,
    DesignationComponent,
    DistrictComponent,
    OfficeComponent,
    DivisionComponent,
    LocationComponent,
    AccountheadComponent,

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    AutocompleteLibModule,
  ]
})
export class ConfigurationModule { }
