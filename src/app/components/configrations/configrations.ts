import { CommonModule } from '@angular/common';
import { PagedResponse } from '../../interfaces/paged-response';
import { Config } from '../../interfaces/Configration/Config';
import { ConfigService } from '../../services/config-service';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { extractBackendError } from '../../services/BackendErroeService';


@Component({
  selector: 'app-configrations',
  standalone:true,
  imports: [CommonModule,RouterLink,FormsModule],
  templateUrl: './configrations.html',
  styleUrl: './configrations.css'
})
export class Configrations {

  data :PagedResponse<Config>|null=null;
       filter:string='';
       search:string='';
       isUnauthorized=false;
    
    
    // Serach Fileds
      
      searchKey = '';
      searchValue = '';
      searchDisplayOrder = '';
      orderKey:boolean=true;
      orderValue:boolean=true
      orderDisplayOrder:boolean=true;
      searchStatus:boolean|null =null;
      toggleKey:boolean=true;
      toggleValue:boolean=true;
      toggleDisplayOrder:boolean=true;

      isloading=false;

      
    
      constructor(private configService: ConfigService) {
        
      }
    
      ngOnInit() {
        // this.configService.getUsers().subscribe((res) => {
        //   this.data=res;
        //   console.log(res);
         
    
        // });
      this.isloading=true;


           this.configService.getUsers().subscribe({
  next: (res: any) => {
    this.data = res;
    console.log('API response:', res);
    this.isloading=false;
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

      clear(){
        this.filter='';
        this.search='';
        this.searchKey = '';
      this.searchValue = '';
      this.searchDisplayOrder = '';
         this.searchStatus = null;
         this.loadPage(1);
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
      console.log("Working");
      this.loadPage(1, newSize); // reload page 1 with new size
    }
  
    
  async deleteUser(userId: string) {
    

    const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You won’t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      });
    this.isloading=true;
      if (result.isConfirmed)
   {
    this.configService.deleteUser(userId).subscribe({
      next: () => {
        this.isloading=false;
        alert('Configration deleted successfully!');
        
        this.loadPage(1);
      },
      error: err => {
        this.isloading=false;
        console.error('Error deleting user:', err);
        
        const backendMessage = extractBackendError(err);
            Swal.fire({
                title: 'Failed to delete configration!',
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
    this.configService.getUsers(this.filter, this.search, isActive, page, pageSize)
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
  
  SearchByKey() {
    this.filter = 'KEY';
    this.search = this.searchKey;
    this.loadPage(1);
  }
  
  SearchByValue() {
    this.filter = 'VALUE';
    this.search = this.searchValue;
    this.loadPage(1);
  }
  
  SearchByDisplayOrder() {
    this.filter = 'DISPLAYORDER';
    this.search = this.searchDisplayOrder;
    this.loadPage(1);
  }


  orderByKey() {
    this.filter = 'ORDERKEY';
    this.search = this.orderKey? 'ASC':'DESC';
    this.loadPage(this.data?.pageNumber || 1 ,this.data?.pageSize || 5,this.searchStatus);
    this.orderKey=!this.orderKey;
    this.toggleKey=!this.toggleKey;
    
  }
  
  orderByValue() {
    this.filter = 'ORDERVALUE';
    this.search = this.orderValue? 'ASC':'DESC';
    this.loadPage(this.data?.pageNumber || 1 ,this.data?.pageSize || 5,this.searchStatus);
    this.orderValue=!this.orderValue;
    this.toggleValue=!this.toggleValue;
    
  }
  
  orderByDisplayOrder() {
    this.filter = 'ORDERDISPLAYORDER';
    this.search = this.orderDisplayOrder? 'ASC':'DESC';
    this.loadPage(this.data?.pageNumber || 1 ,this.data?.pageSize || 5,this.searchStatus);
    this.orderDisplayOrder=!this.orderDisplayOrder;
    this.toggleDisplayOrder=!this.toggleDisplayOrder;
   
  }
  
  SearchByIsActive(isActive: boolean|null) {
  this.filter='ACTIVE'
  console.log(`working ${isActive}`);
  this.loadPage(1, this.data?.pageSize || 5, isActive);
}

toggleActive(item: Config): void {
  this.isloading=true;
  
  item.isActive = !item.isActive;

  // Call backend to toggle on the server
  this.configService.toggleUserActive(item.id,item.isActive).subscribe({
    next: () => {
      this.isloading=false;
      Swal.fire({
        
        title: 'Success!',
        text: 'Config status updated.',
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Configs');

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(blob, 'configs.xlsx');
  }


}
