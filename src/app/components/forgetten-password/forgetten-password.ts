import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginSrvice } from '../../services/login-srvice';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-forgetten-password',
  imports: [RouterLink,CommonModule,FormsModule],
  templateUrl: './forgetten-password.html',
  styleUrl: './forgetten-password.css'
})
export class ForgettenPassword {
  email:string="";
  isloading=false;

  constructor(private accountService:LoginSrvice,private router:Router){

  }


  onSubmit(){
    this.isloading=true;
   if(this.email===""){
   
    this.isloading=false;
        Swal.fire({
            title: 'Email cannot be empty!',
            
            icon: 'error',
            confirmButtonText: 'OK'
        });
    return ;
   }

   this.accountService.forgotPassword(this.email).subscribe({
    next:(res)=>{
      this.isloading=false;
      
      alert(res.message);
      this.router.navigate(['/Login']); 
    },
    error:(err)=>{
      this.isloading=false;
      const backendMessage = err?.error?.errors?.[0]||err?.error?.message || 'Invalid token';
      
          Swal.fire({
              title: 'Change password failed!',
              text: backendMessage,
              icon: 'error',
              confirmButtonText: 'Try again'
          });

    }

  


  });


}

}