import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { FinancialYearService } from './financial-year.service';

@Component({
  selector: 'app-financial-year',
  templateUrl: './financial-year.component.html',
  styleUrls: ['./financial-year.component.css']
})
export class FinancialYearComponent implements OnInit {
  entryForm: FormGroup = this.formBuilder.group(
    {
      id: 0,
      financial_year: ''

    }

  );

  isSuccessful: boolean = false;
  isFail: boolean = false;
  isSignUpFailed = false;
  errorMessage = '';
  isCompleted = true;
  financial_year_list: any = [];
  //financial_year : any = [];
  isShowTable: boolean = true;
  submitted: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private fyService: FinancialYearService

  ) {

    this.entryForm = this.formBuilder.group(
      {
        id: 0,
        financial_year: ''

      }

    );
  }

  ngOnInit(): void {
    this.initialize_entry_form();
    this.loadData();
    this.onFinancialYearChanges();

  }
  onFinancialYearChanges(): void {
   
   
    this.entryForm.get('financial_year')?.valueChanges.subscribe(val => {

      try {
        let fragments = val.split('-');
        if (!this.isNumber(fragments[0])) {
          this.entryForm.setValue({
            id: 0,
            financial_year: '',

          });
        }
        if (fragments.length >= 2 && (!this.isNumber(fragments[1]))) {
          this.entryForm.setValue({
            id: 0,
            financial_year: '',

          });
        }
        if (val != null && val.length == 4) {
          let last_two_digit = parseInt(val.substring(2, 4)) + 1;
          this.entryForm.setValue({
            id: 0,
            financial_year: val + '-' + last_two_digit.toString(),

          });
        }

      } catch (error) {


      }


    });
  }

  onShowTable() {
    this.initializeSuccessFailureStatus();
    this.initialize_entry_form();
    this.onFinancialYearChanges();
    this.showTable();
  }
  onSubmit() {
    this.submitted = true;

    if (this.entryForm.invalid) return;

    if (this.entryForm.value.id <= 0) {
      this.insert();
    }
    else {
      this.update();
    }
  }

  insert() {
    this.fyService.post(this.entryForm.value.financial_year).subscribe({
      next: data => {

        //this.route.navigateByUrl('/config/fy');
        this.switchSuccessFailureStatus(true)

        this.entryForm.reset();
        this.showTable();

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.switchSuccessFailureStatus(false)

      }
    });

  }
  update() {
    this.fyService.put(this.entryForm.value.id, this.entryForm.value.financial_year).subscribe({
      next: data => {

        //this.route.navigateByUrl('/config/fy');
        this.switchSuccessFailureStatus(true)

        this.entryForm.reset();
        this.showTable();

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.switchSuccessFailureStatus(false)

      }
    });

  }

  loadData() {
    this.fyService.get_all().subscribe({
      next: data => {
        this.financial_year_list = data;
        console.log(this.financial_year_list);
      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });

  }

  showTable() {
    this.isShowTable = !this.isShowTable;
    this.loadData();
  }

  onEdit(id: BigInteger) {
    this.reset_operation_messages();
    this.fyService.get_sigle(id).subscribe({
      next: data => {
        // this.financial_year=data;
        this.entryForm.setValue({
          id: data.id,
          financial_year: data.financial_year

        });
        this.showTable();

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  fetchPrevious() {
    console.log('Previous');
    console.log(this.financial_year_list.previous);
    this.getPage(this.financial_year_list.previous);
  }

  fetchNext() {
    console.log('Next');
    console.log(this.financial_year_list.next);
    this.getPage(this.financial_year_list.next);
  }

  getPage(url: string) {
    if (!url) {
      return;
    }
    this.fyService.get_page(url).subscribe({
      next: data => {
        this.financial_year_list = data;
        console.log(this.financial_year_list);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  isNumber(str: string): boolean {
    if (typeof str !== 'string') {
      return false;
    }

    if (str.trim() === '') {
      return false;
    }

    return !Number.isNaN(Number(str));
  }

  // Helper Methods

  switchSuccessFailureStatus(status: boolean) {
    this.isSuccessful = status;
    this.isFail = !status;
  }

  initializeSuccessFailureStatus() {
    this.isSuccessful = false;
    this.isFail = false;
    this.submitted = false;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.entryForm.controls;
  }

  initialize_entry_form()
  {
    this.entryForm = this.formBuilder.group(
      {
        id: 0,
        financial_year: ['', [Validators.required]]

      }
    );
  }

  reset_operation_messages()
  {
    this.isFail=false;
    this.isSuccessful=false;
  }

  
}
