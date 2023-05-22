import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { VendorService } from './vendor.service';
import { time } from 'console';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {

  entryForm: any = [];

  isSuccessful: boolean = false;
  isSignUpFailed = false;
  errorMessage: any = [];
  isCompleted = true;
  item_type_list: any = [];
  //name : any = [];
  isShowTable: boolean = true;
  isFail: boolean = false;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private service: VendorService,

  ) { }

  get name() { return this.entryForm.get('name'); }


  ngOnInit(): void {
    this.loadData();

    this.initialize_entry_form();

  }
  onShowTable() {
    this.submitted = false;
    this.initializeSuccessFailureStatus();
    this.errorMessage = [];
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
        console.log(err)
        this.errorMessage = err.error;
        this.switchSuccessFailureStatus(false)
      }
    });
  }
  update() {
    this.service.put(this.entryForm.value).subscribe({
      next: data => {
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
    this.service.get_all().subscribe({
      next: data => {
        this.item_type_list = data;
        console.log(this.item_type_list);
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
          address: data.address,
          contact_no: data.contact_no,
          gst_no: data.gst_no,
          bank_account_no: data.bank_account_no,
          ifsc: data.ifsc,
          description: data.description,
          remarks: data.remarks,

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
    console.log(this.item_type_list.previous);
    this.getPage(this.item_type_list.previous);
  }

  fetchNext() {
    console.log('Next');
    console.log(this.item_type_list.next);
    this.getPage(this.item_type_list.next);
  }

  getPage(url: string) {
    if (!url) {
      return;
    }
    this.service.get_page(url).subscribe({
      next: data => {
        this.item_type_list = data;
        console.log(this.item_type_list);
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
      //name: '',
      name: ['', [
        Validators.required,
        Validators.maxLength(100),
        Validators.minLength(3),

      ]],
      address: ['', [
        Validators.required,
        Validators.maxLength(1024),


      ]],
      contact_no: ['', [
        Validators.required,
        Validators.maxLength(12),
        Validators.minLength(10),

      ]],
      gst_no: ['', [
        Validators.required,
        Validators.maxLength(15),
        Validators.minLength(15),

      ]],
      bank_account_no: ['', [
        Validators.required,
        Validators.maxLength(25),
        Validators.minLength(8),


      ]],
      ifsc: ['', [
        Validators.required,
        Validators.maxLength(11),
        Validators.minLength(11),

      ]],
      description: ['', [
        Validators.required,
        Validators.maxLength(1024),


      ]],
      remarks: ['', [
        //Validators.required,
        Validators.maxLength(1024),


      ]],

    });

  }

  reset_operation_messages()
  {
    this.isFail=false;
    this.isSuccessful=false;
  }


}
