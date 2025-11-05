import { Component } from '@angular/core';
import { PagedResponse } from '../../interfaces/paged-response';
import { Log } from '../../interfaces/AuditLog/Log';
import { AuditLogService } from '../../services/audit-log-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { extractBackendError } from '../../services/BackendErroeService';

@Component({
  selector: 'app-audit-logs',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './audit-logs.html',
  styleUrl: './audit-logs.css'
})
export class AuditLogs {
  data :PagedResponse<Log>|null=null;
     filter:string='';
     search:string='';
      isUnauthorized=false;
  
  
  // Serach Fileds
    
    searchActivity = '';
    searchType = '';
    searchUsername = '';
    searchDate='';
    orderActivity:boolean=true;

    orderType:boolean=true
    orderUsername:boolean=true;
    orderDate:boolean=true;
    toggleActivity:boolean=true;
    toggleType:boolean=true
    toggleUsername:boolean=true;
    toggleDate:boolean=true;
    isloading=false;
    
    
  
    constructor(private logService: AuditLogService) {
      
    }
  
    ngOnInit() {
      // this.logService.getLogs().subscribe((res) => {
      //   this.data=res;
      //   console.log(res);
       
  
      // });
      this.isloading=true;

      
   this.logService.getLogs().subscribe({
  next: (res: any) => {
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
        confirmButtonText: 'Ok'
    });
  }
});
      
    }
  
    goToPrevious() {
    if (this.data?.hasPreviousPage) {
      this.loadPage(this.data.pageNumber - 1);
    }
  }
  
  goToNext() {
    if (this.data?.hasNextPage) {
      this.loadPage(this.data.pageNumber + 1);
    }
  }
  
  onPageSizeChange(newSize: number) {
    console.log("Working");
    this.loadPage(1, newSize); // reload page 1 with new size
  }

  




loadPage(page: number, pageSize: number = this.data?.pageSize || 5, isActive: boolean | null = null) {
  this.isloading=true;
  this.logService.getLogs(this.filter, this.search, isActive, page, pageSize)
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
        confirmButtonText: 'OK'
    });
      
    });
}

SearchByType() {
  this.filter = 'TYPE';
  this.search = this.searchType;
  this.loadPage(1);
}

SearchByName() {
  this.filter = 'NAME';
  this.search = this.searchUsername;
  this.loadPage(1);
}

SearchByActivity() {
  this.filter = 'ACTIVITY';
  this.search = this.searchActivity;
  this.loadPage(1);
}

SearchByDate() {
  this.filter="DATE";
  this.search=this.searchDate;
  
  console.log(this.search);

  

  this.loadPage(1);
}


orderByType() {
  this.filter = 'ORDERTYPE';
  this.search = this.orderType? 'ASC':'DESC';
  this.loadPage(this.data?.pageNumber || 1 ,this.data?.pageSize || 5);
  this.orderType=!this.orderType;
  this.toggleType=!this.toggleType;
  
}

orderByName() {
  this.filter = 'ORDERNAME';
  this.search = this.orderUsername? 'ASC':'DESC';
  this.loadPage(this.data?.pageNumber || 1 ,this.data?.pageSize || 5);
  this.orderUsername=!this.orderUsername;
  this.toggleUsername=!this.toggleUsername;
 
}

orderByActivity() {
  this.filter = 'ORDERACTIVITY';
  this.search = this.orderActivity? 'ASC':'DESC';
  this.loadPage(this.data?.pageNumber || 1 ,this.data?.pageSize || 5);
  this.orderActivity=!this.orderActivity;
  this.toggleActivity=!this.toggleActivity;
  
}

orderByDate() {
  this.filter="ORDERDATE";
  this.search = this.orderDate? 'ASC':'DESC';
  this.loadPage(this.data?.pageNumber || 1 ,this.data?.pageSize || 5);
  this.orderDate=!this.orderDate;
  this.toggleDate=!this.toggleDate;
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AuditLogs');

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(blob, 'auditLogs.xlsx');
  }
  clear(){
    this.filter='';
    this.search='';
    
    console.log("Search:-",this.search)
    console.log("SearchDate:-",this.searchDate)
    this.searchDate='';
    this.loadPage(1);
  }


}
