import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { DesignationService } from './designation.service';
import { ThemeService } from 'ng2-charts';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.css']
})
export class DesignationComponent implements OnInit {

  entryForm = this.formBuilder.group({
    id: 0,
    name: '',


  });

  isSuccessful: boolean = false;
  isFail: boolean = false;
  isSignUpFailed = false;
  errorMessage = '';
  isCompleted = true;
  item_type_list: any = [];
  //name : any = [];
  isShowTable: boolean = true;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private service: DesignationService,

  ) { }

  ngOnInit(): void {
    this.loadData();
    this.initialize_entry_form();

  }
  onShowTable() {
    this.submitted = false;
    this.initializeSuccessFailureStatus();
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
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128)]],
    });
  }

  reset_operation_messages()
  {
    this.isFail=false;
    this.isSuccessful=false;
  }




}
