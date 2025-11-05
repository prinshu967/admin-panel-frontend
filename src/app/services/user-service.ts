import { HttpClient ,HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User} from '../interfaces/Users/user';
import { PagedResponse } from '../interfaces/paged-response';
import { Add } from '../interfaces/Users/Add';
import { Edit } from '../interfaces/Users/EditUser';
import { EditUserPayload } from '../interfaces/Users/EditUserPayload';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'https://localhost:7001/api/';

  constructor(private http: HttpClient) {}

  getUsers(
  filter: string = '',
  search: string = '', 
  isActive: boolean | null = null, 
  pageNumber: number = 1, 
  pageSize: number = 5
): Observable<PagedResponse<User>> {

  let params = new HttpParams()

  .set('filter.Search', search)
  .set('filter.Filter', filter)
  .set('filter.IsActive', isActive?.toString() ?? '')
  .set('filter.PageNumber', pageNumber.toString())
  .set('filter.PageSize', pageSize.toString());

  console.log({filter,search,isActive,pageNumber,pageSize});

  return this.http.get<PagedResponse<User>>(`${this.url}Users`, { params });
}



  addUser(user:FormData): Observable<any> {
    console.log("At sevice");
    console.log(user);
    return this.http.post<any>(`${this.url}Users`, user);
  }


  getUserById(id: string): Observable<Edit> {
    return this.http.get<Edit>(`${this.url}Users/${id}`);
  }

  updateUser(id: string, user: FormData): Observable<any> {
    return this.http.put(`${this.url}Users/${id}`, user);
  }
  deleteUser(userId: string): Observable<any> {
  return this.http.delete(`${this.url}Users/${userId}`);
  }

  getProfile(): Observable<Edit> {
    return this.http.get<Edit>(`${this.url}Users/GetProfile`);
  }

  updateProfile(user: FormData): Observable<any> {
    return this.http.put(`${this.url}Users/UpdateProfile`, user);
  }

  toggleUserActive(id: string,isActive:boolean): Observable<any> {
  return this.http.patch(`${this.url}Users/${id}`, { isActive });
}


  
}
