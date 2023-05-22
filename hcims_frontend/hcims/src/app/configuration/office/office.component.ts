import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { OfficeService } from './office.service';
import { StateService } from '../state/state.service';
import { DistrictService } from '../district/district.service';


@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.css']
})
export class OfficeComponent implements OnInit {

  entryForm = this.formBuilder.group({
    id: 0,
    state: '',
    district: '',
    name: '',
    address_line1: '',
    address_line2: '',
    address_line3: '',
    pin: '',

  });

  isSuccessful: boolean = false;
  isSignUpFailed: boolean = false;
  errorMessage: string = '';
  isCompleted: boolean = true;
  office_list: any = [];
  state_list: any = [];
  district_list: any = [];
  body_list: any = [];
  //financial_year : any = [];
  isShowTable: boolean = true;
  isFail: boolean = false;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private service: OfficeService,
    private stateService: StateService,
    private districtService: DistrictService,



  ) { }

  ngOnInit(): void {
    this.loadData();
    this.initialize_entry_form();
  }
  onShowTable() {
    this.submitted = false
    this.initializeSuccessFailureStatus()
    this.initialize_entry_form();
    this.showTable();
  }
  onSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    if (this.entryForm.value.id <= 0) {
      this.insert();
    }
    else {
      this.update();
    }
  }

  insert() {

    this.service.post(this.entryForm.value).subscribe({
      next: data => {
        this.switchSuccessFailureStatus(true);
        this.entryForm.reset();
        this.showTable();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.switchSuccessFailureStatus(false);
      }
    });

  }
  update() {
    this.service.put(this.entryForm.value).subscribe({
      next: data => {
        this.switchSuccessFailureStatus(true);
        this.entryForm.reset();
        this.showTable();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.switchSuccessFailureStatus(false);
      }
    });
    console.warn('Your order has been submitted', this.entryForm.value.name);
    this.entryForm.reset();
  }

  loadData() {

    this.loadOffice();
    this.loadState();
    // this.loadBody();
    this.loadDistrict();
  }

  loadOffice() {
    this.service.get_all().subscribe({
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

  loadState() {
    this.stateService.get_all().subscribe({
      next: data => {
        console.log(data);
        this.state_list = data;
        console.log(this.state_list);
      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });

  }

  loadDistrict() {
    this.districtService.get_all().subscribe({
      next: data => {
        console.log(data);
        this.district_list = data;
        console.log(this.state_list);
      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });

  }

  // loadBody()
  // {
  //   this.bodyService.get_all().subscribe({
  //     next: data => {
  //       console.log(data);
  //       this.body_list = data;
  //       console.log(this.state_list);
  //     },

  //   error: err => {
  //     this.errorMessage = err.error.message;
  //     this.isSignUpFailed = true;
  //   }
  //   });

  //}



  showTable() {
    this.isShowTable = !this.isShowTable;
    this.loadData();

  }

  onEdit(id: BigInteger) {
    this.initializeSuccessFailureStatus()
    console.log('id:' + id);
    this.service.get_sigle(id).subscribe({
      next: data => {

        console.log(data);
        this.entryForm.setValue({
          id: data.id,
          state: data.state,
          district: data.district,
          // body : data.body,
          name: data.name,
          address_line1: data.address_line1,
          address_line2: data.address_line2,
          address_line3: data.address_line3,
          pin: data.pin,

        });
        window.scroll(0, 0);
        this.showTable();
        this.isSuccessful = false;

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
  }

  get f(): { [key: string]: AbstractControl } {
    return this.entryForm.controls;
  }

  initialize_entry_form()
  {
    this.entryForm = this.formBuilder.group({
      id: 0,
      state: '',
      district: '',
      name: ['', [
        Validators.required,
        Validators.maxLength(150),
        Validators.minLength(3),

      ]],
      address_line1: ['', [
        Validators.required,
        Validators.maxLength(150),
        Validators.minLength(3),

      ]],
      address_line2: ['', [
        Validators.required,
        Validators.maxLength(150),
        Validators.minLength(3),

      ]],
      address_line3: ['', [
        Validators.required,
        Validators.maxLength(150),
        Validators.minLength(3),

      ]],
      pin: ['', [
        Validators.required,
        Validators.maxLength(6),
        Validators.minLength(6),

      ]],

    });

  }




}
