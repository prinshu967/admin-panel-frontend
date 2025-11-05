import { Injectable } from '@angular/core';
import { CMS } from '../interfaces/CMSs/cms';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResponse } from '../interfaces/paged-response';
import { cmsAdd } from '../interfaces/CMSs/Add';

@Injectable({
  providedIn: 'root'
})
export class CMSService {
  private url = 'https://localhost:7001/api/';

  constructor(private http: HttpClient) {}

  getUsers(
  filter: string = '',
  search: string = '', 
  isActive: boolean | null = null, 
  pageNumber: number = 1, 
  pageSize: number = 5
): Observable<PagedResponse<CMS>> {

  // Build query parameters
  let params = new HttpParams()
  .set('Filter', filter)
  .set('Search', search)
  .set('IsActive', isActive !== null ? isActive.toString() : '')
  .set('PageNumber', pageNumber.toString())
  .set('PageSize', pageSize.toString());


  return this.http.get<PagedResponse<CMS>>(`${this.url}CMS`, { params });
}



  addCMS(user: cmsAdd): Observable<cmsAdd> {
    return this.http.post<cmsAdd>(`${this.url}CMS`, user);
  }


  getCMSById(id: string): Observable<CMS> {
    return this.http.get<CMS>(`${this.url}CMS/${id}`);
  }

  updateCMS(id: string, user: CMS): Observable<any> {
    return this.http.put(`${this.url}CMS/${id}`, user);
  }
  deleteCMS(userId: string): Observable<any> {
  return this.http.delete(`${this.url}CMS/${userId}`);
  }

  toggleUserActive(id: string,isActive:boolean): Observable<any> {
  return this.http.patch(`${this.url}CMS/${id}`, { isActive });
  }

  
}
