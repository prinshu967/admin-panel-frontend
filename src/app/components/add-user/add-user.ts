




import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { RoleService } from '../../services';
import { PagedResponse } from '../../interfaces/paged-response';
import { Role } from '../../interfaces/Roles/role';
import Swal from 'sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';
import { extractBackendError } from '../../services/BackendErroeService';
import { COUNTRIES } from '../../services/CountryCode';



@Component({
  selector: 'adduser',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,NgSelectModule],
  templateUrl: './add-user.html',
  styleUrls: ['./add-user.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddUser implements OnInit {
 

  showPassword:boolean=false;
  userForm!: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  Roles:string[]=[];
  cleanedPhoneNumber:string=""
  isloading=false;
  countries = COUNTRIES;

  constructor(private fb: FormBuilder, private roleService:RoleService, private userService: UserService, private router: Router) {
    
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      FirstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50),Validators.pattern('^[A-Za-z]+(?: [A-Za-z]+)*$')]],
      LastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50),Validators.pattern('^[A-Za-z]+(?: [A-Za-z]+)*$')]],
      Email: ['', [Validators.required, Validators.maxLength(100),Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      CountryCode:[null,[Validators.required]],
      PhoneNumber: ['', [Validators.required,Validators.minLength(6), Validators.pattern(/^\d{6,10}$/)]],

      RoleName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50),Validators.pattern(/\S.*\S|\S/)]],
      IsActive: [true, [Validators.required]],
      Password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/)]],
      profileImage: [null]

      
    });
     

    


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

    // Optional: keep for preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}


  addUser()
   {
    this.isloading=true;
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.isloading=false;
       Swal.fire({
  title: 'Error!',
  text: 'Invalid Form!',
  icon: 'error',
  confirmButtonText: 'OK'
});

      return;
    }

    

    const formData = new FormData();
  formData.append('FirstName', this.userForm.get('FirstName')?.value);
  formData.append('LastName', this.userForm.get('LastName')?.value);
  formData.append('Email', this.userForm.get('Email')?.value);
  formData.append('PhoneNumber', this.userForm.get('CountryCode')?.value+this.userForm.get('PhoneNumber')?.value);
  formData.append('RoleName', this.userForm.get('RoleName')?.value);
  formData.append('IsActive', this.userForm.get('IsActive')?.value.toString());
  formData.append('Password', this.userForm.get('Password')?.value);

  if (this.selectedFile) {
    formData.append('ImageFile', this.selectedFile); // Match backend
  }

    //  Debug check (FormData won't show as object)
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    this.userService.addUser(formData).subscribe({
      next: () => {
        this.isloading=false;
       Swal.fire({
  title: 'Success!',
  text: 'User added successfully!',
  icon: 'success',
  confirmButtonText: 'OK'
});


        this.router.navigate(['/Users']);
      },
      error: (err) => {
        this.isloading=false;
        console.error('Error adding user:', err);

        // const backendMessage =err?.error?.errors?.[0]|| err?.error?.message || 'Something went wrong';
        const backendMessage = extractBackendError(err);

    Swal.fire({
        title: 'Add User Failed!',
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
}

limitNumberLength(event: any, maxLength: number) {
  const input = event.target as HTMLInputElement;
  if (input.value.length > maxLength) {
    input.value = input.value.slice(0, maxLength);
    this.userForm.get('PhoneNumber')?.setValue(input.value);
  }
}


  
}

