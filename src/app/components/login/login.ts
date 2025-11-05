import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup,FormBuilder,Validators, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginSrvice } from '../../services/login-srvice';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginForm: FormGroup;
  submitted = false;
  errorMessage = '';
  isloading=false;

  constructor(
    private fb: FormBuilder,
    private authService: LoginSrvice,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])(?=.*\S).*$/
)]]
    });
  }
  ngOnInit(){
    if(this.authService.isLoggedIn()){
      this.router.navigate(['/Dashboard'])
    }

  }

   limitInput(controlName: string, maxLength: number) {
  const control = this.loginForm.get(controlName);
  console.log(control?.value.length)
  if (control && control.value && control.value.length > maxLength) {
    control.setValue(control.value.slice(0, maxLength), { emitEvent: false });
  }
}

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.isloading=true;
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.isloading=false;
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: res => {
        this.isloading=false;
       Swal.fire({
        title: 'Login Successful!',
        text: 'Welcome back 👋',
        icon: 'success',
        confirmButtonText: 'Continue'
      });
        
        this.router.navigate(['/Dashboard']);
      },
      error: err => {
        this.isloading=false;
        const backendMessage = err?.error?.errors?.[0]||err?.error?.message || 'Invalid email or password.';

    Swal.fire({
        title: 'Login Failed!',
        text: backendMessage,
        icon: 'error',
        confirmButtonText: 'Try Again'
    });
        this.errorMessage = 'Invalid email or password.';
      }
    });
    this.isloading=false;
  }

}
