import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  logoutForm = this.formBuilder.group({
    token: '',
  });

  isSuccessful: boolean = false;
  isSignUpFailed = false;
  errorMessage = '';
  isCompleted = true;
  constructor(private authService: AuthService,
    private formBuilder: FormBuilder,
    private route: Router,
    private localStorageService: LocalStorageService,
  ) { }
  ngOnInit(): void {
  }

  onSubmit() {
    console.log('Before..');
    this.authService.logout().subscribe({
      next: data => {
        console.log(data.token);
        this.localStorageService.clear();
        this.route.navigateByUrl('/login');
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        console.log('Inside success ....');
      },
      error: err => {
        console.log('inside error...')
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
        this.route.navigateByUrl('/login');
      }
    });
    console.warn('Your order has been submitted', this.logoutForm.value.token);


  }


}
