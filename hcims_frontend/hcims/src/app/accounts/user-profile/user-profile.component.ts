import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators , AbstractControl} from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { UserProfileService } from './user-profile.service';
import { DesignationService } from 'src/app/configuration/designation/designation.service';
import { OfficeService } from 'src/app/configuration/office/office.service';
import Validation from 'src/app/utilities/validation';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Console } from 'console';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  dtOptions: DataTables.Settings = {};

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();




  entryForm = this.formBuilder.group({
    id: 0,
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    office: "",
    designation: "",
    password: "",
    password2: "",
    contact_number: "",
    group: "",
  });
  
  submitted:boolean=false;
  isSuccessful: boolean = false;
  isSignUpFailed = false;
  errorMessage = '';
  isCompleted = true;
  user_list: any = [];
  office_list: any = [];
  designation_list: any = [];
  isShowTable: boolean = true;
  group_list: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private service: UserProfileService,
    private designationService: DesignationService,
    private officeService: OfficeService,

  ) { }

  async ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,

    };

    this.initialize_entry_form();
    const that = this;
    this.loadData();
    // this.showTable();
  }
  onShowTable() {
    this.initialize_entry_form();  
    this.showTable();
  }

  onSubmit() {

    this.submitted = true;
    if (this.entryForm.invalid) {
      console.log(this.entryForm);
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
    if (this.entryForm.value.group == 'user')
      this.entryForm.patchValue({
        is_staff: true
      })
    this.service.post(this.entryForm.value).subscribe({
      next: data => {

        //this.route.navigateByUrl('/config/fy');
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.entryForm.reset();
        this.loadData();
        this.showTable();

      },
      error: err => {
        console.log(err);
        this.errorMessage = err;
        this.isSignUpFailed = true;
      }
    });

  }
  update() {
    if (this.entryForm.value.group == 'user')
      this.entryForm.patchValue({
        is_staff: true
      })

    this.service.put(this.entryForm.value).subscribe({
      next: data => {

        //this.route.navigateByUrl('/config/fy');
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.entryForm.reset();
        this.loadData();
        this.showTable();

      },
      error: err => {
        this.errorMessage = err;
        this.isSignUpFailed = true;
      }
    });

  }

  loadData() {

    this.loadUserList();
    this.loadOffice();
    this.loadDesignation();
    this.loadUserGroups();

  }

  loadUserList() {
    this.service.get_all().subscribe({
      next: data => {
        this.user_list = data;
        console.log(this.user_list);
        this.dtTrigger.next(this.user_list);
      },

      error: err => {
        this.errorMessage = err;
        this.isSignUpFailed = true;
      }
    });

  }

  loadOffice() {
    this.officeService.get_all().subscribe({
      next: data => {
        this.office_list = data;
        console.log(this.office_list);
        this.dtTrigger.next(this.office_list);
      },

      error: err => {
        this.errorMessage = err;
        this.isSignUpFailed = true;
      }
    });

  }

  loadDesignation() {
    this.designationService.get_all().subscribe(
      {
        next: data => {
          this.designation_list = data;
          console.log(this.office_list);

        },
        error: err => {
          this.errorMessage = err;
          this.isSignUpFailed = true;
        }
      }
    )
  }

  loadUserGroups() {
    this.service.get_user_group().subscribe(
      {
        next: data => {
          this.group_list = data;
          console.log(this.group_list);

        },
        error: err => {
          this.errorMessage = err;
          this.isSignUpFailed = true;
        }
      }
    )
  }

  showTable() {
    this.isShowTable = !this.isShowTable;
    // this.loadData();
  }

  onEdit(id: number) {
    console.log('id:' + id);
    this.service.get_sigle(id).subscribe({
      next: data => {
        console.log(data);
        this.entryForm.setValue({
          id: data.id,
          username: data.username,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          office: data.related_profile[0] != undefined ? data.related_profile[0].related_office.id : 0,
          designation: data.related_profile[0] != undefined ? data.related_profile[0].related_designation.id : 0,
          password: "",
          password2: "",
          contact_number: data.related_profile[0] != undefined ? data.related_profile[0].contact_number : "",
          group: data.related_groups[0] != undefined ? data.related_groups[0].name : "",

        });
        window.scroll(0, 0);
        this.showTable();

      },
      error: err => {
        this.errorMessage = err;
        this.isSignUpFailed = true;
      }
    });
  }

  onRedirectToDispatchItemList(id: BigInteger) {
    // console.log('id:'+ id);
    // this.localStorageService.setComponentData('dispatch_id',{id:id})
    // console.log(this.localStorageService.getComponentData('dispatch_id'));
    // this.route.navigate(['/inventory/item/dispatch']);

  }

  fetchPrevious() {
    console.log('Previous');
    console.log(this.user_list.previous);
    this.getPage(this.user_list.previous);
  }

  fetchNext() {
    console.log('Next');
    console.log(this.user_list.next);
    this.getPage(this.user_list.next);
  }

  getPage(url: string) {
    if (!url) {
      return;
    }
    this.service.get_page(url).subscribe({
      next: data => {
        this.user_list = data;
        console.log(this.user_list);
      },
      error: err => {
        this.errorMessage = err;
        this.isSignUpFailed = true;
      }
    });
  }

  onChequeChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.entryForm.get('document_url')?.setValue(file);
    }

  }

  getFormData(): FormData {
    let formData: FormData = new FormData();
    // formData.append('id', this.entryForm.value.id);
    // formData.append('to_office', this.entryForm.value.fund);
    // formData.append('to_address', this.entryForm.value.vendor);
    // formData.append('remarks', this.entryForm.value.remarks);
    // formData.append('subject', this.entryForm.value.order_no);
    // formData.append('dispatch_on', this.entryForm.value.invoice_no);
    // formData.append('description', this.entryForm.value.invoice_no);

    return formData;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  // Helper Methods

  get f(): { [key: string]: AbstractControl } {
    return this.entryForm.controls;
  }

  initialize_entry_form()
  {
    this.entryForm = this.formBuilder.group({
      id: 0,
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(256)]],
      email: "",
      first_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(256)]],
      last_name:['', [Validators.required, Validators.minLength(3), Validators.maxLength(256)]],
      office: "",
      designation: "",
      password: ['', [Validators.required, Validators.pattern('(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!#^~%*?&,.<>"\'\\;:\{\\\}\\\[\\\]\\\|\\\+\\\-\\\=\\\_\\\)\\\(\\\)\\\`\\\/\\\\\\]])[A-Za-z0-9\d$@].{7,}')]],
      password2: "",
      contact_number: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(256)]],
      group: "",
    },
    {
      validators: [Validation.match('password', 'password2')]
    }
    );
  }



}
