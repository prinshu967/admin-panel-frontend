import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define a proper interface for your Dashboard data
export interface DashboardDetails {
  totalUsers: number;
  totalRoles: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private url = 'https://localhost:7001/api/';

  constructor(private http: HttpClient) {}

 
  getDetails(): Observable<DashboardDetails> {
    return this.http.get<DashboardDetails>(`${this.url}Dashboard`);
  }
}
