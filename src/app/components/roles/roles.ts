import { Component } from '@angular/core';
import { RoleService } from '../../services';
import { Role } from '../../interfaces/Roles/role';
import { PagedResponse } from '../../interfaces/paged-response';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { extractBackendError } from '../../services/BackendErroeService';



@Component({
  selector: 'roles',
  standalone:true,
  imports: [CommonModule,RouterLink, FormsModule,NgIf],
  templateUrl: './roles.html',
  styleUrl: './roles.css'
})
export class Roles {
   data :PagedResponse<Role>|null=null;

   filter:string='';
   search:string='';
   isUnauthorized=false;
    isloading=false;

// Serach Fileds
  
  searchName = '';
  searchDescription = '';
  orderName:boolean=true;
  orderDescription:boolean=true;
  
  searchStatus:boolean|null =null;
  toggleName:boolean=true;
  toggleDescription:boolean=true;

  constructor(private roleService: RoleService) {}

  ngOnInit() {
    // this.roleService.getRoles().subscribe((res: PagedResponse<Role>) => {
    //   this.data=res;
    //   console.log(this.data);
      
    // });
    this.isloading=true;

    this.roleService.getRoles().subscribe({
  next: (res: PagedResponse<Role>) => {
    this.data = res;
    console.log('API response:', res);
    this.isloading=false;
  },
  error: (err: HttpErrorResponse) => {
    console.error('API error occurred:', err);
    this.isloading=false;
    if (err.status === 401||err.status===403) {
     
      this.isUnauthorized=true;
      
    }
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

//   loadPage(page: number, pageSize: number = this.data?.pageSize ||1) {
//   // Call your service API to fetch data for the given page & size
//   this.roleService.getRoles('', null, page, pageSize).subscribe((res: PagedResponse<Role>) => {
//   this.data = res;
// });


// }


async deleteRole(roleId: string) {
  const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });
  this.isloading=true;
    if (result.isConfirmed) {
    this.roleService.deleteRole(roleId).subscribe({
      next: () => {
        this.isloading=false;
        Swal.fire({
                  title: 'Deleted!',
                  text: 'Role deleted successfully!',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 1500, 
                  timerProgressBar: true
                });
        
        this.loadPage(1);
      },
      error: (err: any) => {
        console.error('Error deleting role:', err);
       
        const backendMessage = extractBackendError(err);
        
            Swal.fire({
                title: 'Failed to delete the role',
                text: backendMessage,
                icon: 'error',
                confirmButtonText: 'OK'
            });
      }
    });
  }
  this.isloading=false;
}


loadPage(page: number, pageSize: number = this.data?.pageSize || 5, isActive: boolean | null = null) {
  this.isloading=true;
  this.roleService.getRoles(this.filter, this.search, isActive, page, pageSize)
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



SearchByName() {
  this.filter = 'NAME';
  this.search = this.searchName;
  console.log(`working ${this.search}`);
  this.loadPage(1);
}

SearchByDescription() {
  this.filter = 'DESCRIPTION';
  this.search = this.searchDescription;
   console.log(`working ${this.search}`);
  this.loadPage(1);
}
orderByName() {
  this.filter = 'ORDERNAME';
  this.search = this.orderName? 'ASC':'DESC';
  this.loadPage(this.data?.pageNumber || 1 ,this.data?.pageSize || 5,this.searchStatus);
  this.orderName=!this.orderName;
  this.toggleName=!this.toggleName;
  
}

orderByDescription() {
  this.filter = 'ORDERDESCRIPTION';
 this.search = this.orderDescription? 'ASC':'DESC';
  this.loadPage(this.data?.pageNumber || 1 ,this.data?.pageSize || 5,this.searchStatus);
  this.orderDescription=!this.orderDescription;
  this.toggleDescription=!this.toggleDescription;
  
}

SearchByIsActive(isActive: boolean|null) {
  this.search='';
  this.filter='ACTIVE'
  console.log(`working ${isActive}`);

  

  this.loadPage(1, this.data?.pageSize || 5, isActive);
  
}
clear(){
  this.filter='';
  this.search='';

  this.searchName = '';
  this.searchDescription = '';
   this.searchStatus = null;
  this.loadPage(1);
}



toggleActive(item: Role): void {
  this.isloading=true;
  
  item.isActive = !item.isActive;

  // Call backend to toggle on the server
  this.roleService.toggleUserActive(item.id,item.isActive).subscribe({
    next: () => {
      this.isloading=false;
      Swal.fire({
        
        title: 'Success!',
        text: 'Role status updated.',
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Roles');

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(blob, 'roles.xlsx');
  }





}
