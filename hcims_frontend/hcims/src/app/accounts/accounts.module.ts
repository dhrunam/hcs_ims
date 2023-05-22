import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from './logout/logout.component';
import { UserProfileComponent } from './user-profile/user-profile.component';


@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    LogoutComponent,
    UserProfileComponent
  ],
  imports: [
   CommonModule,
   ReactiveFormsModule,
   DataTablesModule,
   SharedModule,
  ]
})
export class AccountsModule { }
