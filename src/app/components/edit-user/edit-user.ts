// import { Component } from '@angular/core';
// import { UserService } from '../../services/user-service';
// import { Edit } from '../../interfaces/Users/EditUser';
// import { Router, ActivatedRoute, RouterModule, RouterLink } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { CommonModule, NgIf } from '@angular/common';
// import { EditUserPayload } from '../../interfaces/Users/EditUserPayload';

// @Component({
//   selector: 'app-edit-user',
//   imports: [FormsModule,CommonModule,RouterModule,NgIf],
//   templateUrl: './edit-user.html',
//   styleUrls: ['./edit-user.css'] 
// })
// export class EditUser {
//   userId: string = '';
//   user: Edit | null = null; 
  

//   constructor(
//     private route: ActivatedRoute,
//     private userService: UserService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.userId = this.route.snapshot.paramMap.get('id') || '';
    

//     if (this.userId) {
//       this.userService.getUserById(this.userId).subscribe({
//         next: (res: Edit) => {
//           this.user = res;
//         },
//         error: (err: any) => console.error('Error fetching user:', err) 
//       });
//     }
//   }

//  updateUser() {
//   if (this.user) {
//     const payload = {
//       id: this.user.id,
//       firstName: this.user.firstName,
//       lastName: this.user.lastName,
//       email: this.user.email,
//       phoneNumber: this.user.phoneNumber,
//       isActive: this.user.isActive,
//       roleName: this.user.roles[0]    };

//     this.userService.updateUser(this.userId, payload).subscribe({
//       next: () => {
//         alert('User updated successfully!');
//         this.router.navigate(['/Users']);
//       },
//       error: err => console.error('Error updating user:', err)
//     });
//   }
// }

//   onCancel() {
//     this.router.navigate(['/Users']);
//   }
  

  
// }


import { Component, OnInit ,ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user-service';
import { RoleService } from '../../services';
import { PagedResponse } from '../../interfaces/paged-response';
import { Role } from '../../interfaces/Roles/role';
import Swal from 'sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';
import { extractBackendError } from '../../services/BackendErroeService';
import { COUNTRIES } from '../../services/CountryCode';




@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,NgSelectModule],
  templateUrl: './edit-user.html',
  styleUrls: ['./edit-user.css'],
  encapsulation:ViewEncapsulation.None
})
export class EditUser  {
  isloading=false;
  userForm!: FormGroup;
  userId!: string;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  showPassword=false;
  countries=COUNTRIES


  Roles:string[]=[];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private roleService:RoleService
  ) {}

  ngOnInit(): void {
    this.isloading=true;
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    this.userForm = this.fb.group({
            Id: [this.userId, Validators.required],
            FirstName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50),Validators.pattern('^[A-Za-z]+(?: [A-Za-z]+)*$')]],
            LastName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50),Validators.pattern('^[A-Za-z]+(?: [A-Za-z]+)*$')]],
            Email: [null, [
              Validators.required,
              Validators.email,
              Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
            ]],
            CountryCode:[ null,[Validators.required]],
            PhoneNumber: [null, [Validators.required, Validators.pattern(/^\d{6,10}$/)]],
            RoleName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50),Validators.pattern(/\S.*\S|\S/)]],
            IsActive: [null,[ Validators.required]],
            profileImage: [null],
            NewPassword: [null,[ Validators.minLength(6), Validators.maxLength(20),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/)]]
          });

    if (this.userId) {
      
      this.userService.getUserById(this.userId).subscribe({
        next: (res) => {
          console.log(res);
          this.isloading=false;
          const country = this.countries.find(c => res.phoneNumber.startsWith(c.code));

         let phoneOnly = res.phoneNumber;
         if (country) {
         phoneOnly = phoneOnly.replace(country.code, '');
        }
         
          this.userForm = this.fb.group({
            Id: [this.userId, Validators.required],
            FirstName: [res.firstName, [Validators.required, Validators.minLength(2), Validators.maxLength(50),Validators.pattern('^[A-Za-z]+(?: [A-Za-z]+)*$')]],
            LastName: [res.lastName, [Validators.required, Validators.minLength(2), Validators.maxLength(50),Validators.pattern('^[A-Za-z]+(?: [A-Za-z]+)*$')]],
            Email: [res.email, [
              Validators.required,
              Validators.email,
              Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
            ]],
            CountryCode:[country ? country.code : null,[Validators.required]],
            PhoneNumber: [phoneOnly, [Validators.required, Validators.pattern(/^\d{6,10}$/)]],
            RoleName: [res.roles?.[0] || '', [Validators.required, Validators.minLength(2), Validators.maxLength(50),Validators.pattern(/\S.*\S|\S/)]],
            IsActive: [res.isActive,[ Validators.required]],
            profileImage: [null],
            NewPassword: ['',[ Validators.minLength(6), Validators.maxLength(20),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/)]]
          });

          


          //  If image URL comes from backend, show it
          if (res.imagePath) {
            this.imagePreview = res.imagePath;
          }
        },
        error: (err) => {
          this.isloading=false;
          console.error('Error fetching user:', err);
        }
      });
    }

    this.roleService.getRoles('','',null,1,1000).subscribe((res: PagedResponse<Role>) => {
      this.Roles = res.items.map(role => role.name); 
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
       const allowedTypes = ['image/jpeg', 'image/png'];
          const maxSizeInMB = 5;
          const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      
          // Check file type
          if (!allowedTypes.includes(file.type)) {
            Swal.fire({
              title: 'Invalid File Type!',
              text: 'Only JPG, PNG, and JPEG files are allowed.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
            event.target.value = '';
            this.selectedFile = null;
            this.imagePreview = null;
            return;
          }
      
          
          if (file.size > maxSizeInBytes) {
            Swal.fire({
              title: 'File Too Large!',
              text: `Maximum allowed size is ${maxSizeInMB} MB.`,
              icon: 'warning',
              confirmButtonText: 'OK'
            });
            event.target.value = '';
            this.selectedFile = null;
            this.imagePreview = null;
            return;
          }
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  updateUser() {
    if (!this.userForm || this.userForm.invalid) {
      this.userForm?.markAllAsTouched();


     Swal.fire({
         icon: 'error',                
         title: 'Invalid Form',              
         text: 'Please fill out all required fields correctly.',
         showConfirmButton: true,
         confirmButtonText: 'OK',
         confirmButtonColor: '#e74c3c', // red button
         background: '#fff'
      });


      
      return;
    }

    this.isloading=true;
    
    const formData = new FormData();
    formData.append('Id', this.userId);
    formData.append('FirstName', this.userForm.get('FirstName')?.value);
    formData.append('LastName', this.userForm.get('LastName')?.value);
    formData.append('Email', this.userForm.get('Email')?.value);
    formData.append('PhoneNumber', this.userForm.get('CountryCode')?.value+this.userForm.get('PhoneNumber')?.value);
    formData.append('RoleName', this.userForm.get('RoleName')?.value);
    formData.append('IsActive', this.userForm.get('IsActive')?.value.toString());
    formData.append('NewPassword', this.userForm.get('NewPassword')?.value || '');


    
    //  Only include new image if user selected one
    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.userService.updateUser(this.userId, formData).subscribe({
      next: () => {
        this.isloading=false;
         localStorage.setItem('profileImageUpdated', this.userId);
        Swal.fire({
          title: 'Success!',
          text: 'User edited successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        
       
        this.router.navigate(['/Users']);
      },
      error: (err) => {
        this.isloading=false;
        console.error('Error updating user:', err);
        const backendMessage = extractBackendError(err);
        
                  Swal.fire({
                    title: 'User Edit Failed!',
                    text: backendMessage,
                    icon: 'error',
                    confirmButtonText: 'Try Again'
            });
      }
    });
  }

  cancel() {
    this.router.navigate(['/Users']);
  }


  limitInput(controlName: string, maxLength: number) {
  const control = this.userForm.get(controlName);
  if (control && control.value && control.value.length > maxLength) {
    control.setValue(control.value.slice(0, maxLength), { emitEvent: false });
  }
  control?.setValue(control?.value.trimStart());
}

limitNumberLength(event: any, maxLength: number) {
  const input = event.target as HTMLInputElement;
  if (input.value.length > maxLength) {
    input.value = input.value.slice(0, maxLength);
    this.userForm.get('PhoneNumber')?.setValue(input.value);
  }
}



}
