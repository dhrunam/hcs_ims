import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  logoutForm = this.formBuilder.group({
    token: ''

  });

  isSuccessful: boolean = false;
  isSignUpFailed = false;
  errorMessage = '';
  isCompleted = true;
  login_user_name = "";



  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private localStorageservice: LocalStorageService,
  ) { }

  ngOnInit(): void {

    // this.login_user_name=CryptoJS.AES.decrypt(this.localStorageservice.getUser(),SECRET_KEY).toString(CryptoJS.enc.Utf8);
    let user = this.localStorageservice.getUser();
    this.login_user_name = user.username;
  }

  onSubmit() {

    this.authService.logout().subscribe({
      next: data => {
        this.localStorageservice.signOut();
        this.route.navigateByUrl('/login');
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
        this.localStorageservice.signOut();
      }
    });
    console.warn('Your order has been submitted', this.logoutForm.value.token);
  }


}
