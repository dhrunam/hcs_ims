import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './guards/auth.guard';



@NgModule({
  declarations: [
    PageNotFoundComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UtilitiesModule {}
