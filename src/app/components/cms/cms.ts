import { Component, OnInit } from '@angular/core';
import { PagedResponse } from '../../interfaces/paged-response';
import { CMS  as c} from '../../interfaces/CMSs/cms';
import { CMSService } from '../../services/cmsservice';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { extractBackendError } from '../../services/BackendErroeService';



@Component({
  selector: 'app-cms',
  imports: [FormsModule,RouterLink,CommonModule,NgIf],
  templateUrl: './cms.html',
  styleUrls: ['./cms.css']
})
export class CMSComponent implements OnInit {


  data :PagedResponse<c>|null=null;

  filter:string='';
   search:string='';
   isUnauthorized=false
   isloading=false;


// Serach Fileds
  searchKey = '';
  searchTitle = '';
  searchMetaTitle = '';
  searchMetaDescription = '';
  orderKey:boolean=true;
  orderTitle:boolean=true;
  orderMetaTitle:boolean=true;
  
  orderMetaDescription:boolean=true;
  searchStatus:boolean|null =null;
  searchMetaKeyword='';
  orderMetaKeyword:boolean=true;
  toggleKey:boolean=true;
  toggleTitle:boolean=true;
  toggleMetaTitle:boolean=true;
  toggleMetaDescription:boolean=true;
  toggleMetaKeyword:boolean=true;   
  
    constructor(private CMSService: CMSService) {}
  
    ngOnInit() {
      // this.CMSService.getUsers().subscribe((res: PagedResponse<c>) => {
      //   this.data = res;
      //   console.log(res);
      // });
      this.isloading=true;

      this.CMSService.getUsers().subscribe({
  next: (res: PagedResponse<c>) => {
    this.data = res;
    this.isloading=false;
    console.log('API response:', res);
  },
  error: (err: HttpErrorResponse) => {
    this.isloading=false;
    console.error('API error occurred:', err);
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
  
  // loadPage(page: number, pageSize: number = this.data?.pageSize ||1) {
  //   // Call your service API to fetch data for the given page & size
  //   this.CMSService.getUsers('', null, page, pageSize).subscribe(res => {
  //   this.data = res;
  // });
  
  // }


  loadPage(page: number, pageSize: number = this.data?.pageSize || 5, isActive: boolean | null = null) {
    this.isloading=true;
  this.CMSService.getUsers(this.filter, this.search, isActive, page, pageSize)
    .subscribe(res => {
      this.data = res;
      this.isloading=false;
    }, err => {
      this.isloading=false;
      console.error(err.error.errors); 
      const backendMessage = extractBackendError(err);
      
          Swal.fire({
              title: 'Page Load  Failed!',
              text: backendMessage,
              icon: 'error',
              confirmButtonText: 'Ok'
          });
    });
}

  
  
  async deleteCMS(userId: string) {
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
      this.CMSService.deleteCMS(userId).subscribe({
        next: () => {
          this.isloading=false;
         Swal.fire({
                   title: 'Deleted!',
                   text: 'CMS deleted successfully!',
                   icon: 'success',
                   showConfirmButton: false,
                   timer: 1500, 
                   timerProgressBar: true
                 });
          this.loadPage(1);
        },
        error: err => {
          this.isloading=false;
          console.error('Error deleting user:', err);
          const backendMessage =extractBackendError(err);
          
              Swal.fire({
                  title: 'Failed to delete  CMS',
                  text: backendMessage,
                  icon: 'error',
                  confirmButtonText: 'Try Again'
              });

        }
      });
    }
    this.isloading=false;
  }

  clear(){
    this.filter='';
    this.search='';
    this.searchKey = '';
  this.searchTitle = '';
  this.searchMetaTitle = '';
  this.searchMetaKeyword='';
  this.searchMetaDescription = '';
    this.searchStatus = null;
    this.loadPage(1);
  }



  SearchByKey() {
  this.filter = 'KEY';
  this.search = this.searchKey;
  console.log(`working ${this.search}`);
  this.loadPage(1);
}

SearchByTitle() {
  this.filter = 'TITLE';

  this.search = this.searchTitle;
  console.log(`working ${this.search}`);
  this.loadPage(1);
}

SearchByMetaTitle() {
  this.filter = 'METATITLE';
  this.search = this.searchMetaTitle;
  console.log(`working ${this.search}`);
  this.loadPage(1);
}
SearchByMetaDescription() {
  this.filter = 'METADESCRIPTION';
  this.search = this.searchMetaDescription;
  console.log(`working ${this.search}`);
  this.loadPage(1);
}
SearchByMetaKeyword() {
  this.filter = 'METAKEYWORD';
  this.search = this.searchMetaKeyword;
  console.log(`working ${this.search}`);
  this.loadPage(1);
}


orderByKey() {
  this.filter = 'ORDERKEY';
  this.search = this.orderKey? 'ASC':'DESC';
  this.loadPage(this.data?.pageNumber || 1 ,this.data?.pageSize || 5,this.searchStatus);
  this.orderKey=!this.orderKey;
  this.toggleKey=!this.toggleKey;
}

orderByTitle() {
  this.filter = 'ORDERTITLE';

  this.search = this.orderTitle? 'ASC':'DESC';  
  this.loadPage(this.data?.pageNumber || 1 ,this.data?.pageSize || 5,this.searchStatus);
  this.orderTitle=!this.orderTitle;
  this.toggleTitle=!this.toggleTitle;
  
}

orderByMetaTitle() {
  this.filter = 'ORDERMETATITLE';
  this.search = this.orderMetaTitle? 'ASC':'DESC';
  this.loadPage(this.data?.pageNumber || 1 ,this.data?.pageSize || 5,this.searchStatus);
  this.orderMetaTitle=!this.orderMetaTitle;
  this.toggleMetaTitle=!this.toggleMetaTitle;
  
}
orderByMetaDescription() {
  this.filter = 'ORDERMETADESCRIPTION';
  this.search = this.orderMetaDescription? 'ASC':'DESC';
  this.loadPage(this.data?.pageNumber || 1 ,this.data?.pageSize || 5,this.searchStatus);
  this.orderMetaDescription=!this.orderMetaDescription;
  this.toggleMetaDescription=!this.toggleMetaDescription;
  
}
orderByMetaKeyword() {
  this.filter = 'ORDERMETAKEYWORD';
  this.search = this.orderMetaKeyword? 'ASC':'DESC';
  this.loadPage(this.data?.pageNumber || 1 ,this.data?.pageSize || 5,this.searchStatus);
  this.orderMetaKeyword=!this.orderMetaKeyword;
  this.toggleMetaKeyword=!this.toggleMetaKeyword;
 
}




SearchByIsActive(isActive: boolean|null) {
  this.filter='ACTIVE'
  console.log(`working ${isActive}`);

  

  this.loadPage(1, this.data?.pageSize || 5, isActive);
}

toggleActive(item:c): void {
  this.isloading=true;
  
  item.isActive = !item.isActive;

  // Call backend to toggle on the server
  this.CMSService.toggleUserActive(item.id,item.isActive).subscribe({
    next: () => {
      this.isloading=false;
      Swal.fire({
        
        title: 'Success!',
        text: 'CMS status updated.',
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
      const backendMessage = err?.error?.errors?.[0]||err?.error?.message || 'Something went wrong';

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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'CMS');

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(blob, 'cms.xlsx');
  }



}
