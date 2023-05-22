import { Component, OnInit } from '@angular/core';
import { FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { DivisionService } from './division.service';
import { OfficeService } from '../office/office.service';
@Component({
  selector: 'app-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.css']
})
export class DivisionComponent implements OnInit {

  entryForm = this.formBuilder.group({
    id: 0,
    name: '',
    office: '',

  });

  isSuccessful: boolean = false;
  isFail: boolean = false;
  isSignUpFailed = false;
  errorMessage = '';
  isCompleted = true;
  division_list: any = [];
  office_list: any = [];
  //financial_year : any = [];
  isShowTable: boolean = true;
  submitted: boolean = false


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private service: DivisionService,
    private officeService: OfficeService

  ) { }

  ngOnInit(): void {
    this.loadData();
    this.initialize_entry_form();

  }
  onShowTable() {
    this.initializeSuccessFailureStatus();
    this.initialize_entry_form();
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

    console.log(this.entryForm.value.name);
    this.service.post(this.entryForm.value).subscribe({
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
    console.warn('Your order has been submitted', this.entryForm.value.name);
    this.entryForm.reset();
  }
  update() {
    this.service.put(this.entryForm.value).subscribe({
      next: data => {

        //this.route.navigateByUrl('/config/fy');
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.entryForm.reset();
        this.showTable();

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
    console.warn('Your order has been submitted', this.entryForm.value.name);
    this.entryForm.reset();
  }

  loadData() {

    this.loadDivision();
    this.loadOffice();
  }

  loadDivision() {
    this.service.get_all().subscribe({
      next: data => {
        this.division_list = data;
        console.log(this.division_list);
      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  loadOffice() {
    this.officeService.get_all().subscribe({
      next: data => {
        console.log(data);
        this.office_list = data;
        console.log(this.office_list);
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
    console.log('id:' + id);
    this.service.get_sigle(id).subscribe({
      next: data => {
        console.log(data);
        this.entryForm.setValue({
          id: data.id,
          name: data.name,
          office: data.office

        });
        window.scroll(0, 0);
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
    console.log(this.office_list.previous);
    this.getPage(this.office_list.previous);
  }

  fetchNext() {
    console.log('Next');
    console.log(this.office_list.next);
    this.getPage(this.office_list.next);
  }

  getPage(url: string) {
    if (!url) {
      return;
    }
    this.service.get_page(url).subscribe({
      next: data => {
        this.office_list = data;
        console.log(this.office_list);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
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
    this.entryForm = this.formBuilder.group({
      id: 0,
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128)]],
      office: ['', [Validators.required]],

    });
  }

  reset_operation_messages()
  {
    this.isFail=false;
    this.isSuccessful=false;
  }





}
