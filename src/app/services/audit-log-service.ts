import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { PagedResponse } from '../interfaces/paged-response';
import { Observable } from 'rxjs';
import { Log } from '../interfaces/AuditLog/Log';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private url = 'https://localhost:7001/api/';

  constructor(private http: HttpClient) {}

  getLogs(
  filter: string = '',
  search: string = '', 
  isActive: boolean | null = null, 
  pageNumber: number = 1, 
  pageSize: number = 5
): Observable<PagedResponse<Log>> {

  let params = new HttpParams()

  .set('Search', search)
  .set('Filter', filter)
  .set('IsActive', isActive?.toString() ?? '')
  .set('PageNumber', pageNumber.toString())
  .set('PageSize', pageSize.toString());

  console.log({filter,search,isActive,pageNumber,pageSize});
  console.log(params);

  return this.http.get<PagedResponse<Log>>(`${this.url}AuditLog`, { params });
}
}
