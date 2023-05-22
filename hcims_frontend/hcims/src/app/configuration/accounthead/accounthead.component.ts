import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { AccountheadService } from './accounthead.service';

@Component({
  selector: 'app-accounthead',
  templateUrl: './accounthead.component.html',
  styleUrls: ['./accounthead.component.css']
})
export class AccountheadComponent implements OnInit {

  entryForm = this.formBuilder.group({
    id: 0,
    name: ''

  });

  isSuccessful: boolean = false;
  isFail: boolean = false;
  isSignUpFailed = false;
  errorMessage = '';
  isCompleted = true;
  account_head_list: any = [];
  //name : any = [];
  isShowTable: boolean = true;
  submitted: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private service: AccountheadService

  ) { }

  ngOnInit(): void {
    this.loadData();
    this.initialize_entry_form();

  }
  onShowTable() {
    this.submitted = false;
    this.initialize_entry_form();
    this.showTable();
    this.initializeSuccessFailureStatus();
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

  loadData() {
    this.service.get_all().subscribe({
      next: data => {
        this.account_head_list = data;
        console.log(this.account_head_list);
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
    this.isSuccessful = false;
    console.log('id:' + id);
    this.service.get_sigle(id).subscribe({
      next: data => {
        console.log(data);
        this.entryForm.setValue({
          id: data.id,
          name: data.name

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
    console.log(this.account_head_list.previous);
    this.getPage(this.account_head_list.previous);
  }

  fetchNext() {
    console.log('Next');
    console.log(this.account_head_list.next);
    this.getPage(this.account_head_list.next);
  }

  getPage(url: string) {
    if (!url) {
      return;
    }
    this.service.get_page(url).subscribe({
      next: data => {
        this.account_head_list = data;
        console.log(this.account_head_list);
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
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(256)]]

    });
  }



}
