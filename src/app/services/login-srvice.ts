import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
type LoginResponse ={
  message: string;
  data: {
    token: string;
    expiresAt: string;
    userId: string;
    email: string;
    userName: string;
    roles: string[];
    imagePath:string;
  };
}


@Injectable({
  providedIn: 'root'
})
export class LoginSrvice {
  email:string="";
  token:string="";
 


  constructor(private http:HttpClient,private route:ActivatedRoute,private router:Router){

    
  }
  
  url="https://localhost:7001/api/Account/";

  

 login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('userId',response.data.userId);
          localStorage.setItem('token', response.data.token);
          // localStorage.setItem('imageUrl',response.data.imagePath);
          // localStorage.setItem('userName',response.data.userName);
          // localStorage.setItem('role',response.data.roles[0]);
          localStorage.setItem('profileImageUpdated', response.data.userId);
          
          console.log(response.data);
         

        })
      );
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !this.isTokenExpired(token);
  }

//   logout(): void {
//   this.http.post(`${this.url}logout`, {}).subscribe({
//     next: () => {
      
//       localStorage.removeItem('token');
//       localStorage.removeItem('imageUrl');
//       alert("Logout successful")
//       console.log('Logout successful');
//     },
//     error: err => {
//       console.error('Logout failed', err);
//     }
//   });
// }

logout(): Observable<any> {
  return this.http.post(`${this.url}logout`, {});
}

forgotPassword(email: string): Observable<any> {
  return this.http.post<any>(`${this.url}ForgotPassword`, { email });
}


resetPassword({ password, confirmPassword }: { password: string; confirmPassword: string }): Observable<any> {
  const email = this.route.snapshot.queryParamMap.get('email') || '';
  const token = this.route.snapshot.queryParamMap.get('token') || '';
  

  const body = {
    email: email,
    token: token,
    password: password,
    confirmPassword: confirmPassword
  };
  console.log(body);

  return this.http.post<any>(`${this.url}ResetPassword`, body);
}

isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000; 
      return Date.now() > expiryTime;
    } catch {
      return true;
    }
  }


}

  

