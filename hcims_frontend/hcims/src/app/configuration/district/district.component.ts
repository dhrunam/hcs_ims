import { Component, OnInit } from '@angular/core';
import { FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { DistrictService } from './district.service';
import { StateService } from '../state/state.service';
import { identifierName } from '@angular/compiler';


@Component({
  selector: 'app-district',
  templateUrl: './district.component.html',
  styleUrls: ['./district.component.css']
})
export class DistrictComponent implements OnInit {

  entryForm = this.formBuilder.group({
    id: 0,
    name: '',
    state: 0,

  });

  isSuccessful: boolean = false;
  isFail: boolean = false;
  isSignUpFailed = false;
  errorMessage = '';
  isCompleted = true;
  district_list: any = [];
  state_list: any = [];
  //financial_year : any = [];
  isShowTable: boolean = true;
  submitted: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private service: DistrictService,
    private itemTypeservice: StateService

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
    console.log('Submitted..');
    this.submitted = true;
    console.log(this.entryForm);
    if (this.entryForm.invalid) {
      console.log('Invalid...');
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

    console.log(this.entryForm.value);
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

  }
  update() {
    this.service.put(this.entryForm.value).subscribe({
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

    this.loadItem();
    this.loadItemType();
  }

  loadItem() {
    this.service.get_all().subscribe({
      next: data => {
        this.district_list = data;
        console.log(this.district_list);
      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  loadItemType() {
    this.itemTypeservice.get_all().subscribe({
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
          state: data.state

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
    console.log(this.district_list.previous);
    this.getPage(this.district_list.previous);
    window.scroll(0, 0);
  }

  fetchNext() {
    console.log('Next');
    console.log(this.district_list.next);
    this.getPage(this.district_list.next);
    window.scroll(0, 0);
  }

  getPage(url: string) {
    if (!url) {
      return;
    }
    this.service.get_page(url).subscribe({
      next: data => {
        this.district_list = data;
        console.log(this.district_list);
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
      name: ['Test', [Validators.required, Validators.minLength(3), Validators.maxLength(128)]],
      state: [0, [Validators.required]],

    });
  }

  reset_operation_messages()
  {
    this.isFail=false;
    this.isSuccessful=false;
  }




}
