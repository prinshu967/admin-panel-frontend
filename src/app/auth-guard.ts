// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginSrvice } from './services/login-srvice';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private accountService: LoginSrvice, private router: Router) {}

  canActivate(): boolean {
    if (this.accountService.isLoggedIn()) {
      
      
      return true; 
    } else {
      
      this.router.navigate(['/Login']); 
      return false;
    }
  }
}
