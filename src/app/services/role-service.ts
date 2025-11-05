import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../interfaces/Roles/role';
import { PagedResponse } from '../interfaces/paged-response';
import { AddRole } from '../interfaces/Roles/AddRole';
import { EditRole } from '../interfaces/Roles/EditRole';


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private url = 'https://localhost:7001/api/Roles/';

  constructor(private http: HttpClient) {}

  getRoles(
    filter:string='',
    search: string = '',
    isActive: boolean | null = null,
    pageNumber: number = 1,
    pageSize: number = 5
  ): Observable<PagedResponse<Role>> {
    let params = new HttpParams()
      .set('filter.Search', search)
  .set('filter.Filter', filter)
  .set('filter.IsActive', isActive?.toString() ?? '')
  .set('filter.PageNumber', pageNumber.toString())
  .set('filter.PageSize', pageSize.toString());

      console.log(params);

    return this.http.get<PagedResponse<Role>>(`${this.url}Roles`, { params });
  }

  addRole(role: AddRole): Observable<Role> {
    return this.http.post<Role>(`${this.url}Create`, role);
  }

  getRoleById(id: string): Observable<EditRole> {
    return this.http.get<EditRole>(`${this.url}${id}`);
  }

  updateRole(id: string, role: EditRole): Observable<any> {
    return this.http.put(`${this.url}Update/${id}`, role);
  }

  deleteRole(roleId: string): Observable<any> {
    return this.http.delete(`${this.url}Delete/${roleId}`);
  }
  toggleUserActive(id: string,isActive:boolean): Observable<any> {
  return this.http.patch(`${this.url}${id}`, { isActive });

  }

}
