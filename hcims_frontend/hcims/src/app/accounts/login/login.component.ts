import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = this.formBuilder.group({
    username: '',
    password: ''
  });

  isSuccessful: boolean = false;
  isSignUpFailed = false;
  errorMessage = '';
  isCompleted = true;
  user_name = "";
  constructor(private authService: AuthService,
    private formBuilder: FormBuilder,
    private route: Router,
    private localStorageService: LocalStorageService

  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.user_name = this.loginForm.value.username;
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password, 'web').subscribe({
      next: data => {

        if (data.token) {

          this.localStorageService.clear();
          this.localStorageService.saveToken(data.token);
          this.localStorageService.saveUser(data.user)
          this.localStorageService.saveTokenExpiry(data.expiry);
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this.route.navigateByUrl('/dashboard');
        }
        else {
          this.loginForm.reset();
        }

      },
      error: err => {
        console.log(err)
        this.errorMessage = err;
        this.isSignUpFailed = true;
      }
    });
    console.warn('Your order has been submitted', this.loginForm.value.username);
    this.loginForm.reset();

  }

}
