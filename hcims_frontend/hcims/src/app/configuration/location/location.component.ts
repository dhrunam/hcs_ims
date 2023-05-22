import { Component, OnInit } from '@angular/core';
import { FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { OfficeService } from '../office/office.service';
import { LocationService } from './location.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  entryForm = this.formBuilder.group({
    id: 0,
    office: '',
    name: '',
    type: '',
    parents_location: '',

  });

  isSuccessful: boolean = false;
  isFail: boolean = false;
  isSignUpFailed: boolean = false;
  errorMessage: string = '';
  isCompleted: boolean = true;
  location_list: any = [];
  office_list: any = [];
  type_choices: any = [{ 'name': 'Office', 'value': 'office' },
  { 'name': 'Building', 'value': 'building' },
  { 'name': 'Floor', 'value': 'floor' },
  { 'name': 'Section', 'value': 'section' },

  ]
  isShowTable: boolean = true;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private service: LocationService,
    private officeService: OfficeService,
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
    console.log(this.entryForm.invalid);
    if (this.entryForm.invalid) return;

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
        this.switchSuccessFailureStatus(true)
        this.isSignUpFailed = false;
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
    this.loadLocation();
    this.loadOffice();

  }

  loadLocation() {
    this.service.get_all().subscribe({
      next: data => {
        console.log(data);
        this.location_list = data;
        console.log(this.location_list);
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
          office: data.office,
          name: data.name,
          type: data.type,
          parents_location: data.parents_location,
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
    console.log(this.location_list.previous);
    this.getPage(this.location_list.previous);
  }

  fetchNext() {
    console.log('Next');
    console.log(this.location_list.next);
    this.getPage(this.location_list.next);
  }

  getPage(url: string) {
    if (!url) {
      return;
    }
    this.service.get_page(url).subscribe({
      next: data => {
        this.location_list = data;
        console.log(this.location_list);
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
      office: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128)]],
      type: ['', [Validators.required]],
      parents_location: '',

    });
  }

  reset_operation_messages()
  {
    this.isFail=false;
    this.isSuccessful=false;
  }

}
