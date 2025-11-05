import { Component } from '@angular/core';
import { UserService } from '../../services/user-service';
import { User } from '../../interfaces/Users/user';
import { PagedResponse } from '../../interfaces/paged-response';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import Swal from 'sweetalert2';
import { extractBackendError } from '../../services/BackendErroeService';




@Component({
  selector: 'users',
  standalone:true,
  imports: [CommonModule,RouterLink, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users {
   data :PagedResponse<User>|null=null;
   filter:string='';
   search:string='';
   isUnauthorized=false;
   isloading=true;


// Serach Fileds
  searchEmail = '';
  searchName = '';
  searchPhone = '';
  searchUsername = '';
  searchStatus:boolean|null =null;
  orderName:boolean=true;
  orderEmail:boolean=true
  orderPhone:boolean=true;
  toggleName:boolean=true;
  toggleEmail:boolean=true;
  togglePhone:boolean=  true;
  

  constructor(private userService: UserService) {
    
  }

  ngOnInit() {
    this.isloading=true;
   this.userService.getUsers().subscribe({
  next: (res: any) => {
    this.data = res;
    console.log('API response:', res);
    this.isloading=false;
  },
  error: (err: HttpErrorResponse) => {
    console.error('API error occurred:', err);
    if (err.status === 401||err.status===403) {
     
      this.isUnauthorized=true;
      
    }
    this.isloading=false;

    const backendMessage = extractBackendError(err);
    
        Swal.fire({
            title: 'Page Load  Failed!',
            text: backendMessage,
            icon: 'error',
            confirmButtonText: 'OK'
        });
  }
});
    
  }

  goToPrevious() {
  if (this.data?.hasPreviousPage) {
    this.loadPage(this.data.pageNumber - 1,this.data.pageSize,this.searchStatus);
  }
}

goToNext() {
  if (this.data?.hasNextPage) {
   this.loadPage(this.data.pageNumber + 1,this.data.pageSize,this.searchStatus);
  }
}

onPageSizeChange(newSize: number) {
  this.loadPage(1, newSize); // reload page 1 with new size
}

// loadPage(page: number, pageSize: number = this.data?.pageSize ||1) {
//   // Call your service API to fetch data for the given page & size
//   this.userService.getUsers(this.filter,this.search, null, page, pageSize).subscribe(res => {
//   this.data = res;
// });

// }


async deleteUser(userId: string) {
  
  const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });
    
  
    if (result.isConfirmed) {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
       
       Swal.fire({
          title: 'Deleted!',
          text: 'User deleted successfully!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500, 
          timerProgressBar: true
        });
        
        this.loadPage(1);
      },
      error: err => {
       
        console.error('Error deleting user:', err);
       const backendMessage = extractBackendError(err);
       
           Swal.fire({
               title: 'Failed to Delete the User!',
               text: backendMessage,
               icon: 'error',
               confirmButtonText: 'OK'
           });
      }
    });
  }
  this.isloading=false;
}

// SearchByEmail() {
//     this.filter = 'EMAIL';
//     this.loadPage(1);
//   }

//   SearchByName() {
//     this.filter = 'NAME';
//     this.loadPage(1);
//   }

//   SearchByPhone() {
//     this.filter = 'PHONE';
//     this.loadPage(1);
//   }

//   SearchByIsActive() {
    
//     this.loadPage(1);
//   }


loadPage(page: number, pageSize: number = this.data?.pageSize || 5, isActive: boolean | null = null) {
  this.isloading=true;
  this.userService.getUsers(this.filter, this.search, isActive, page, pageSize)
    .subscribe(res => {
      this.data = res;
      this.isloading=false;
    }, err => {
      this.isloading=false;
      const backendMessage = extractBackendError(err);
      
          Swal.fire({
              title: 'Page Load  Failed!',
              text: backendMessage,
              icon: 'error',
              confirmButtonText: 'OK'
          });
    });
}

SearchByEmail() {
  this.filter = 'EMAIL';
  this.search = this.searchEmail;
  this.loadPage(1);
}

SearchByName() {
  this.filter = 'NAME';
  this.search = this.searchName;
  this.loadPage(1);
}

SearchByPhone() {
  this.filter = 'PHONE';
  this.search = this.searchPhone;
  this.loadPage(1);
}


OrderByEmail() {
  this.filter = 'ORDEREMAIL';
  this.search = this.orderEmail? 'ASC':'DESC';
  this.loadPage(this.data?.pageNumber || 1 ,this.data?.pageSize || 5,this.searchStatus);
  this.orderEmail=!this.orderEmail;
  this.toggleEmail=!this.toggleEmail;
  
  
}

OrderByName() {
  this.filter = 'ORDERNAME';
  this.search = this.orderName? 'ASC':'DESC';
  this.loadPage(this.data?.pageNumber || 1, this.data?.pageSize || 5, this.searchStatus);
  this.orderName=!this.orderName;
  this.toggleName=!this.toggleName;
  
 
}

OrderByPhone() {
  this.filter = 'ORDERPHONE';
  this.search = this.orderPhone? 'ASC':'DESC';
  this.loadPage(this.data?.pageNumber || 1 ,this.data?.pageSize || 5, this.searchStatus);
  this.orderPhone=!this.orderPhone;
  this.togglePhone=!this.togglePhone;
 
 
}



SearchByIsActive(isActive: boolean|null) {
  this.filter='ACTIVE'
  console.log(`working ${isActive}`);

  

  this.loadPage(1, this.data?.pageSize || 5, isActive);

}

clear() {
  
  this.filter='';
  this.search='';
  this.searchEmail = '';
  this.searchName = '';
  this.searchPhone = '';
  this.searchUsername = '';
  this.searchStatus = null;
  this.loadPage(1);
}


toggleActive(item: User): void {
  this.isloading=true;
  
  item.isActive = !item.isActive;

  // Call backend to toggle on the server
  this.userService.toggleUserActive(item.id,item.isActive).subscribe({
    next: () => {
      this.isloading=false;
      Swal.fire({
        
        title: 'Success!',
        text: 'User status updated.',
        icon: 'success',
        showConfirmButton: false,   
        timer: 1000,                
        timerProgressBar: true,     
        position: 'top',   
             
        toast: true,   
                  
      });
    },
    error: (err) => {
      this.isloading=false;
      console.error('Error updating user:', err);
      const backendMessage = extractBackendError(err);

      // revert toggle since backend failed
      item.isActive = !item.isActive;

      Swal.fire({
        title: 'Update Failed!',
        text: backendMessage,
        icon: 'error',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        position: 'top',
        toast: true,
      });
    },
  });
}
exportToExcel(): void {
    if (!this.data || this.data.items.length === 0) {
      Swal.fire({
        title: 'Export Failed!',
        text: 'No user data available to export.',
        icon: 'error',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        position: 'top',
        toast: true,
      });
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(this.data.items);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(blob, 'users.xlsx');
  }










}
