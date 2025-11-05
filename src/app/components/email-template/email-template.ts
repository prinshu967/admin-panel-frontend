import { Component } from '@angular/core';
import { emailTemplate } from '../../interfaces/EmailTemplate/EmailTemplate';
import { EmailTemplateService } from '../../services/EmailTemplateService';
import { PagedResponse } from '../../interfaces/paged-response';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { extractBackendError } from '../../services/BackendErroeService';

@Component({
  selector: 'app-email-template',
  imports: [RouterLink,FormsModule,CommonModule,NgIf],
  templateUrl: './email-template.html',
  styleUrl: './email-template.css'
})
export class EmailTemplate {

  



  data :PagedResponse<emailTemplate>|null=null;



  filter:string='';
   search:string='';
   isUnauthorized=false
   


// Serach Fileds
  searchKey = '';
  searchTitle = '';
  
  searchSubject='';
  orderKey:boolean=true;
  orderTitle:boolean=true;
  orderSubject:boolean=true;
  toggleKey:boolean=true;
  toggleTitle:boolean=true;
  toggleSubject:boolean=true; 
  
  searchStatus:boolean|null =null;
  searchMetaKeyword='';
 
  isloading=false;

    
      constructor(private emailService: EmailTemplateService) {}
    
      ngOnInit() {
        // this.emailService.getEmailTemplates().subscribe((res: PagedResponse<emailTemplate>) => {
        //   this.data = res;
        //   console.log(res);
        // }); 

        this.isloading=true;


        this.emailService.getEmailTemplates().subscribe({
  next: (res: PagedResponse<emailTemplate>) => {
    this.data = res;
    this.isloading=false;
    console.log('API response:', res);
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
    
    // loadPage(page: number, pageSize: number = this.data?.pageSize ||1) {
    //   // Call your service API to fetch data for the given page & size
    //   this.emailService.getEmailTemplates(this.filter,this.search, page, pageSize).subscribe(res => {
    //   this.data = res;
    // });
    
    // }

    loadPage(page: number, pageSize: number = this.data?.pageSize || 5, isActive: boolean | null = null) {
      this.isloading=true;
  this.emailService.getEmailTemplates(this.filter, this.search, isActive, page, pageSize)
    .subscribe(res => {
      this.data = res;
      this.isloading=false;
    }, err => {
      this.isloading=false;
      const backendMessage =err?.error?.errors?.[0]|| err?.error?.message || 'You do not have access';
      
          Swal.fire({
              title: 'Page Load  Failed!',
              text: backendMessage,
              icon: 'error',
              confirmButtonText: 'OK'
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
        this.emailService.delete(userId).subscribe({
          next: () => {
            this.isloading=false;
           Swal.fire({
                     title: 'Deleted!',
                     text: 'Email template deleted successfully!',
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
            
            const backendMessage = extractBackendError(err);
            
                Swal.fire({
                    title: 'Failed to Delete Email Template!',
                    text: backendMessage,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
          }
        });
      }
      this.isloading=false;
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

SearchBySubject() {
  this.filter = 'SUBJECT';
  this.search = this.searchSubject;
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

orderBySubject() {
  this.filter = 'ORDERSUBJECT';
  this.search = this.orderSubject? 'ASC':'DESC';
  this.loadPage(this.data?.pageNumber || 1 ,this.data?.pageSize || 5,this.searchStatus);
  this.orderSubject=!this.orderSubject;
  this.toggleSubject=!this.toggleSubject;
 
}
clear(){
  this.searchKey = '';
  this.searchTitle = '';
  this.filter='';
  this.search='';
  
  this.searchSubject='';
   this.searchStatus = null;
   this.loadPage(1);
}



SearchByIsActive(isActive: boolean|null) {
  this.filter='ACTIVE'
  console.log(`working ${isActive}`);

  

  this.loadPage(1, this.data?.pageSize || 5, isActive);
}

toggleActive(item: emailTemplate): void {
  this.isloading=true;
  
  item.isActive = !item.isActive;

  // Call backend to toggle on the server
  this.emailService.toggleUserActive(item.id,item.isActive).subscribe({
    next: () => {
      this.isloading=false;
      Swal.fire({
        
        title: 'Success!',
        text: 'EmailTemplate status updated.',
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
  this.isloading=false;
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'EmailTemplates');

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(blob, 'emailTemplates.xlsx');
  }

  

}
