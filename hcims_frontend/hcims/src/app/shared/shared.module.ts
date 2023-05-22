import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestPipe } from './test.pipe';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PublicModule } from '../public/public.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TestPipe,
    HeaderComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, RouterModule

  ],
  exports: [HeaderComponent, SidebarComponent],
})
export class SharedModule { }
