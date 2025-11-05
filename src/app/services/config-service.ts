import { Injectable } from '@angular/core';
import { Config } from '../interfaces/Configration/Config';
import { PagedResponse } from '../interfaces/paged-response';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
   private url = 'https://localhost:7001/api/';

  constructor(private http: HttpClient) {}

  getUsers(
  filter: string = '',
  search: string = '', 
  isActive: boolean | null = null, 
  pageNumber: number = 1, 
  pageSize: number = 5
): Observable<PagedResponse<Config>> {

  let params = new HttpParams()

  .set('Search', search)
  .set('Filter', filter)
  .set('IsActive', isActive?.toString() ?? '')
  .set('PageNumber', pageNumber.toString())
  .set('PageSize', pageSize.toString());

  console.log({filter,search,isActive,pageNumber,pageSize});

  return this.http.get<PagedResponse<Config>>(`${this.url}ApplicationConfigration`, { params });
}



  addUser(user:Config): Observable<any> {
    console.log("At service");
    console.log(user);
    return this.http.post<any>(`${this.url}ApplicationConfigration`, user);
  }


  getUserById(id: string): Observable<Config> {
    return this.http.get<Config>(`${this.url}ApplicationConfigration/${id}`);
  }

  updateUser(id: string, user: Config): Observable<any> {
    return this.http.put(`${this.url}ApplicationConfigration/${id}`, user);
  }
  deleteUser(userId: string): Observable<any> {
  return this.http.delete(`${this.url}ApplicationConfigration/${userId}`);
  }

  toggleUserActive(id: string,isActive:boolean): Observable<any> {
  return this.http.patch(`${this.url}ApplicationConfigration/${id}`, { isActive });
  }

}
