import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { NgChartsModule, NgChartsConfiguration } from 'ng2-charts';
import { ChartTestComponent } from './chart-test/chart-test.component';



@NgModule({
  declarations: [
    DashboardComponent,
    ChartTestComponent
  ],
  imports: [
    SharedModule,
    NgChartsModule,
    CommonModule
  ],
  providers: [
    { provide: NgChartsConfiguration, useValue: { generateColors: false } }
  ]

})
export class PublicModule { }
