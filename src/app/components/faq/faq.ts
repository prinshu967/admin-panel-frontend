// import { Component } from '@angular/core';
// import { PagedResponse } from '../../interfaces/paged-response';
// import { FAQItem } from '../../interfaces/FAQs/FQQ';
// import { FAQService } from '../../services/faqservice';
// import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
// import { RouterLink, RouterModule } from '@angular/router';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-faq',
//   standalone:true, 
//   imports: [CommonModule,RouterModule,FormsModule],
//   templateUrl: './faq.html',
//   styleUrl: './faq.css'
// })
// export class FAQ {
//   data :PagedResponse<FAQItem>|null=null;
//        filter:string='';
//        search:string='';
    
    
//     // Serach Fileds
      
//       searchQuestion = '';
//       searchDisplayOrder = '';
//       searchStatus:boolean|null =null;
      
      
    
//       constructor(private faqService: FAQService) {
        
//       }
    
//       ngOnInit() {
//         this.faqService.getUsers.subscribe((res) => {
//           this.data=res;
//           console.log(res);
         
    
//         });
        
//       }
    
//       goToPrevious() {
//       if (this.data?.hasPreviousPage) {
//         this.loadPage(this.data.pageNumber - 1);
//       }
//     }
    
//     goToNext() {
//       if (this.data?.hasNextPage) {
//         this.loadPage(this.data.pageNumber + 1);
//       }
//     }
    
//     onPageSizeChange(newSize: number) {
//       console.log("Working");
//       this.loadPage(1, newSize); // reload page 1 with new size
//     }
  
    
//   deleteUser(userId: string) {
//   if (confirm('Are you sure you want to delete this user?')) {
//     this.faqService.deleteUser(userId).subscribe({
//       next: () => {
//         alert('User deleted successfully!');
        
//         this.loadPage(1);
//       },
//       error: err => {
//         console.error('Error deleting user:', err);
//         alert('Failed to delete user. Please try again.');
//       }
//     });
//   }
// }
  
  
  
//   loadPage(page: number, pageSize: number = this.data?.pageSize || 5, isActive: boolean | null = null) {
//     this.faqService.getUsers(this.filter, this.search, isActive, page, pageSize)
//       .subscribe(res => {
//         this.data = res;
//       }, err => {
//         console.error(err.error.errors); // logs backend validation errors
//       });
//   }
  
//   SearchByQuestion() {
//     this.filter = 'EMAIL';
//     this.search = this.searchQuestion;
//     this.loadPage(1);
//   }
  
  
  
  
//   SearchByDisplayOrder() {
//     this.filter = 'DISPLAYORDER';
//     this.search = this.searchDisplayOrder;
//     this.loadPage(1);
//   }
  
//   SearchByIsActive(isActive: boolean|null) {
//   this.filter='ACTIVE'
//   console.log(`working ${isActive}`);
//   this.loadPage(1, this.data?.pageSize || 5, isActive);
// }


// }


import { Component } from '@angular/core';
import { PagedResponse } from '../../interfaces/paged-response';
import { FAQItem } from '../../interfaces/FAQs/FQQ';
import { FAQService } from '../../services/faqservice';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { extractBackendError } from '../../services/BackendErroeService';


@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './faq.html',
  styleUrls: ['./faq.css']
})
export class FAQ {
  isloading=false;
  data: PagedResponse<FAQItem> | null = null;
  filter: string = '';
  search: string = '';

  // Search fields
  searchQuestion = '';
  searchDisplayOrder = '';
  searchStatus: boolean | null = null;
  orederQuestion: boolean = true;
  orderDisplayOrder: boolean = true;
  toggleQuestion: boolean = true;
  toggleDisplayOrder: boolean = true;
  
  constructor(private faqService: FAQService) {}

  ngOnInit() {
    this.loadPage(1);
    
  }
  clear(){
    this.filter='';
    this.search='';
    this.searchQuestion = '';
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
    this.loadPage(1, newSize);
  }

  async deleteFaq(faqId: string) {
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
      this.faqService.deleteFaq(faqId).subscribe({
        next: () => {
          this.isloading=false;
          Swal.fire({
                    title: 'Deleted!',
                    text: 'FAQ deleted successfully!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500, 
                    timerProgressBar: true
                  });
          this.loadPage(1);
        },
        error: err => {
          this.isloading=false;
          console.error('Error deleting FAQ:', err);
       
          const backendMessage = extractBackendError(err);
          
              Swal.fire({
                  title: 'Failed to Delete FAQ!',
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
    this.faqService.getFaqs(this.filter, this.search, isActive, page, pageSize).subscribe({
      next: res => {
        this.data = res
        this.isloading=false;},
      error: err => {
        console.error(err.error.errors)
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

  SearchByQuestion() {
    this.filter = 'QUESTION';
    this.search = this.searchQuestion;
    this.loadPage(1);
  }

  SearchByDisplayOrder() {
    this.filter = 'DISPLAYORDER';
    this.search = this.searchDisplayOrder;
    this.loadPage(1);
  }
  orderByQuestion() {
    this.filter = 'ORDERQUESTION';
    this.search = this.orederQuestion? 'ASC':'DESC';
    this.loadPage(this.data?.pageNumber || 1 ,this.data?.pageSize || 5,this.searchStatus);
    this.orederQuestion=!this.orederQuestion;
    this.toggleQuestion=!this.toggleQuestion;
    
  }

  orderByDisplayOrder() {
    this.filter = 'ORDERDISPLAYORDER';
    this.search = this.orderDisplayOrder? 'ASC':'DESC';
    this.loadPage(this.data?.pageNumber || 1 ,this.data?.pageSize || 5,this.searchStatus);
    this.orderDisplayOrder=!this.orderDisplayOrder;
    this.toggleDisplayOrder=!this.toggleDisplayOrder;
   
  }


  SearchByIsActive(isActive: boolean | null) {
    this.filter = 'ISACTIVE';
    this.loadPage(1, this.data?.pageSize || 5, isActive);
  }


toggleActive(item:FAQItem ): void {
  this.isloading=true;
  
  item.isActive = !item.isActive;

  // Call backend to toggle on the server
  this.faqService.toggleUserActive(item.id,item.isActive).subscribe({
    next: () => {
      this.isloading=false;
      Swal.fire({
        
        title: 'Success!',
        text: 'FAQ status updated.',
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FAQ');

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(blob, 'faq.xlsx');
  }


  

}

