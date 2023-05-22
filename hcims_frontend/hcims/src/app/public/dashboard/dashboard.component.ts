import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserProfileService } from 'src/app/accounts/user-profile/user-profile.service';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { FinancialYearService } from 'src/app/configuration/financial-year/financial-year.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) pieChart: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) barChart: BaseChartDirective | undefined;

  financial_year_list: any = [];
  financial_year_wise_fund_received: any = [];
  financial_year_wise_fund_utilized: any = [];
  isSuccessful: boolean = false;
  isFail: boolean = true;
  reportShow: boolean = true;

  errorMessage = '';
  isCompleted = true;

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Fund Received', backgroundColor: '#fe6659' },
      { data: [], label: 'Fund Utilized', backgroundColor: '#95d6fa' },

    ],

  };

  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Fund Received', 'Fund Utilized'],
    datasets: [{
      data: [],
      backgroundColor: ['#fe6659', '#95d6fa']
    }]
  };

  isChartShow: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private service: UserProfileService,
    private financialYearService: FinancialYearService,
    private locaStorageService: LocalStorageService

  ) { }

  ngOnInit(): void {
    this.loadLoginUser();
    this.loadData();

  }

  loadData() {
    this.financialYearService.get_fund_utilization_report().subscribe({
      next: data => {
        this.financial_year_list = [];
        data.results.forEach((element: any) => {
          console.log(element.financial_year);
          this.financial_year_list.push(element['financial_year']);
          this.financial_year_wise_fund_received.push(element['fund_received']);
          this.financial_year_wise_fund_utilized.push(element['fund_utilized'])
        });

        console.log(this.financial_year_list);
        this.barChartData.labels = this.financial_year_list;
        this.barChartData.datasets[0].data = this.financial_year_wise_fund_received;
        this.barChartData.datasets[1].data = this.financial_year_wise_fund_utilized;
        this.barChart?.update();
        [1, 2, 3, 4].reduce((a, b) => a + b, 0)

        this.pieChartData.datasets[0].data[0] = this.financial_year_wise_fund_received.reduce((a: number, b: number) => a + b, 0)
        this.pieChartData.datasets[0].data[1] = this.financial_year_wise_fund_utilized.reduce((a: number, b: number) => a + b, 0)
        this.pieChart?.update();

        this.isChartShow = true;
      },

      error: err => {
        this.errorMessage = err.error.message;

      }
    });

  }

  loadLoginUser() {
    this.reportShow = false;
    const user = this.locaStorageService.getUser();

    if (user.related_groups.length > 0) {
      if (user.related_groups[0].name == 'hc-user') {

        this.reportShow = true;
      }
      else {
        this.reportShow = false;
      }
    }
    console.log(this.reportShow);

  }

  // Bar Chart section
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0
      }
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        rotation: -90
      }
    }
  };

  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];

  // public barChartData: ChartData<'bar'> = {
  //   labels: ['2021', '2022', '2023', '2024'],
  //   datasets: [
  //     { data: [65, 59, 80, 81], label: 'Fund Received', backgroundColor: '#fe6659' },
  //     { data: [28, 48, 40, 19], label: 'Fund Utilized', backgroundColor: '#95d6fa' },

  //   ],

  // };

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
      40];

    this.barChart?.update();
  }

  // End Bar Chart section

  // Pie chart section

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    }
  };
  // public pieChartData: ChartData<'pie', number[], string | string[]> = {
  //   labels: ['Fund Received', 'Fund Utilized'],
  //   datasets: [{
  //     data: [300, 500],
  //     backgroundColor: ['#fe6659', '#95d6fa']
  //   }]
  // };
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [DataLabelsPlugin];

  // events
  public pieChartClicked({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public pieChartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }


  // End Pie Chart Section


}
