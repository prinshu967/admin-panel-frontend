import { Component } from '@angular/core';
import { ReactiveFormsModule ,FormBuilder,FormGroup,Validators} from '@angular/forms';
import { LoginSrvice } from '../../services/login-srvice';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { extractBackendError } from '../../services/BackendErroeService';



@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {
  isloading=false;
  resetForm!: FormGroup;
  
  submitted = false;

  constructor(private accountService:LoginSrvice,private fb:FormBuilder,private router:Router){

  }

  ngOnInit(): void {
    

    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

 onSubmit() {
  this.isloading=true;
  
  const password = this.f['password'].value;
  const confirmPassword = this.f['confirmPassword'].value;

  this.accountService.resetPassword({ password, confirmPassword }).subscribe({
    next: () => {
      this.isloading=false;
      Swal.fire('Success!', 'Password has been reset successfully!', 'success');
      //
      
      this.router.navigate(['/Login']);
    },
    error: (err) => {
      console.error(err);
      this.isloading=false;
      
      const backendMessage = extractBackendError(err);
// -      const backendMessage = err?.error?.errors?.[0]||err?.error?.message || 'Something went wrong';
 
      
          Swal.fire({
              title: 'Failed to Reset the Password !',
              text: backendMessage,
              icon: 'error',
              confirmButtonText: 'OK'
          });
    }
  });
}


  get f(){
    return this.resetForm.controls;
  }

}
