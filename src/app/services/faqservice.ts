import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { PagedResponse } from '../interfaces/paged-response';
import { FAQItem } from '../interfaces/FAQs/FQQ';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FAQService {
   private url = 'https://localhost:7001/api/';

  constructor(private http: HttpClient) {}

  getFaqs(
  filter: string = '',
  search: string = '', 
  isActive: boolean | null = null, 
  pageNumber: number = 1, 
  pageSize: number = 5
): Observable<PagedResponse<FAQItem>> {

  let params = new HttpParams()

  .set('Search', search)
  .set('Filter', filter)
  .set('IsActive', isActive?.toString() ?? '')
  .set('PageNumber', pageNumber.toString())
  .set('PageSize', pageSize.toString());

  console.log({filter,search,isActive,pageNumber,pageSize});

  return this.http.get<PagedResponse<FAQItem>>(`${this.url}FAQ`, { params });
}



  addFaq(user:FAQItem): Observable<FAQItem> {
    console.log("At sevice");
    console.log(user);
    return this.http.post<any>(`${this.url}FAQ`, user);
  }


  getFaqById(id: string): Observable<FAQItem> {
    return this.http.get<FAQItem>(`${this.url}FAQ/${id}`);
  }

  updateFaq(id: string, user: FAQItem): Observable<any> {
    return this.http.put(`${this.url}FAQ/${id}`, user);
  }
  deleteFaq(userId: string): Observable<any> {
  return this.http.delete(`${this.url}FAQ/${userId}`);
  }

  toggleUserActive(id: string,isActive:boolean): Observable<any> {
  return this.http.patch(`${this.url}FAQ/${id}`, { isActive });
  }

}
