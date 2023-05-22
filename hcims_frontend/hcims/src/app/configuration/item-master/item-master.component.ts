import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { ItemMasterService } from './item-master.service';
import { ItemTypeService } from '../item-type/item-type.service';

@Component({
  selector: 'app-item-master',
  templateUrl: './item-master.component.html',
  styleUrls: ['./item-master.component.css']
})
export class ItemMasterComponent implements OnInit {

  @ViewChild('item_auto_complete') item_auto_complete: any;
  entryForm = this.formBuilder.group({
    id: 0,
    name: '',
    item_type: '',

  });

  isSuccessful: boolean = false;
  isFail: boolean = false;
  isSignUpFailed = false;
  errorMessage = '';
  isCompleted = true;
  item_list: any = [];
  item_type_list: any = [];
  selected_item_type: any = {};
  keyword = 'name';
  //financial_year : any = [];
  isShowTable: boolean = true;
  submitted: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private service: ItemMasterService,
    private itemTypeservice: ItemTypeService

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
        this.item_list = data;
        console.log(this.item_list);
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
        this.item_type_list = [];
        data.results.forEach((e: any) => {
          this.item_type_list.push({ id: e.id, name: e.name });
        });
        // this.selected_item_type =
        // {
        //   id: data.results[0].id,
        //   name: data.results[0].name,
        // };
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

        this.selected_item_type = {
          id: data.related_item_type.id,
          name: data.related_item_type.name
        }

        this.entryForm.setValue({
          id: data.id,
          name: data.name,
          item_type: data.item_type

        });
        this.item_type_list.push({
          id: data.related_item_type.id,
          name: data.related_item_type.name
        })
        this.selected_item_type = {
          id: data.related_item_type.id,
          name: data.related_item_type.name
        }
        window.scroll(0, 0);
        this.isShowTable = !this.isShowTable;

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  fetchPrevious() {
    console.log('Previous');
    console.log(this.item_list.previous);
    this.getPage(this.item_list.previous);
  }

  fetchNext() {
    console.log('Next');
    console.log(this.item_list.next);
    this.getPage(this.item_list.next);
  }

  getPage(url: string) {
    if (!url) {
      return;
    }
    this.service.get_page(url).subscribe({
      next: data => {
        this.item_list = data;
        console.log(this.item_list);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  selectEvent(event: any) {
    console.log(event);
    this.entryForm.patchValue({
      item_type: event.id

    });
  }

  onChangeSearch(val: string) {

    let temp_item_list: any = [];
    this.itemTypeservice.get_all_by_search_key(val).subscribe({
      next: data => {

        data.results.forEach((e: any) => {
          temp_item_list.push({ id: e.id, name: e.name });

        });

        this.item_auto_complete.data = temp_item_list;
        this.item_auto_complete.isLoading = false;
      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
    //}
  }

  onFocused(event: any) {

  }

  onInputCleared(event: any) {
    if (this.item_auto_complete !== undefined) {

      this.item_auto_complete.data = this.item_type_list;

    }
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
      item_type: ['', [Validators.required]],

    });
  }

  reset_operation_messages()
  {
    this.isFail=false;
    this.isSuccessful=false;
  }



}
