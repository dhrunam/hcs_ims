import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: any = {
    username: null,
    email: null,
    password: null
  };
  isSuccessful: boolean = false;
  isSignUpFailed = false;
  errorMessage = '';
  isCompleted = true;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {}

  onSubmit(){
    const { username, email, password } = this.form;
    
    this.authService.register(username, email, password).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

}
