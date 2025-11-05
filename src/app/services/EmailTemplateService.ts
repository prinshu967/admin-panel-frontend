import { Injectable } from '@angular/core';
import { emailTemplate } from '../interfaces/EmailTemplate/EmailTemplate';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { PagedResponse } from '../interfaces/paged-response';
@Injectable({
  providedIn: 'root'
})
export class EmailTemplateService {
  private url = 'https://localhost:7001/api/';

  constructor(private http: HttpClient) {}

  getEmailTemplates(
  filter:string='',
  search: string = '', 
  isActive: boolean | null = null, 
  pageNumber: number = 1, 
  pageSize: number = 5
): Observable<PagedResponse<emailTemplate>> {

  // Build query parameters
  let params = new HttpParams()
    .set('Filter',filter)
    .set('Search', search)
    .set('IsActive', isActive !== null ? isActive.toString() : '')
    .set('PageNumber', pageNumber.toString())
    .set('PageSize', pageSize.toString());
    

  return this.http.get<PagedResponse<emailTemplate>>(`${this.url}EmailTemplates`, { params });
}


  add(user: emailTemplate): Observable<emailTemplate> {
    return this.http.post<emailTemplate>(`${this.url}EmailTemplates`, user);
  }

  getById(id: string): Observable<emailTemplate> {
    return this.http.get<emailTemplate>(`${this.url}EmailTemplates/${id}`);
  }

  update(id: string, emailTemplate: emailTemplate): Observable<any> {
    return this.http.put(`${this.url}EmailTemplates/${id}`, emailTemplate);
  }

  delete(userId: string): Observable<any> {
    return this.http.delete(`${this.url}EmailTemplates/${userId}`);
  }
  toggleUserActive(id: string,isActive:boolean): Observable<any> {
  return this.http.patch(`${this.url}EmailTemplates/${id}`, { isActive });
  }
}
