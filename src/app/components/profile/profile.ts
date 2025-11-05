import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../services';
import { extractBackendError } from '../../services/BackendErroeService';
import { COUNTRIES } from '../../services/CountryCode';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,NgSelectModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {

  userForm!: FormGroup;
  userId: string | null = null;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  cleanedPhoneNumber = '';
  FisrstName!:string;
  LastName!:string;
  countries=COUNTRIES

  // Password toggles
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  isloading=false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isloading=true;
    this.userId = localStorage.getItem('userId');

    if (this.userId) {
      this.userService.getProfile().subscribe({
        next: (res) => {
          this.isloading=false;
          this.cleanedPhoneNumber = res.phoneNumber;
          this.FisrstName=res.firstName;
          this.LastName=res.lastName; 
          const country = this.countries.find(c => res.phoneNumber.startsWith(c.code));

         let phoneOnly = res.phoneNumber;
         if (country) {
         phoneOnly = phoneOnly.replace(country.code, '');
        }

          this.userForm = this.fb.group({
            Id: [this.userId, Validators.required],
            FirstName: [res.firstName, [
              Validators.required,
              Validators.minLength(2),
              Validators.maxLength(50),
              Validators.pattern('^[A-Za-z]+(?: [A-Za-z]+)*$')

            ]],
            LastName: [res.lastName, [
              Validators.required,
              Validators.maxLength(50),
              Validators.pattern('^[A-Za-z]+(?: [A-Za-z]+)*$')

            ]],
            Email: [res.email, [Validators.required, Validators.maxLength(100),Validators.email,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
            CountryCode:[country ? country.code : null,[Validators.required]],
            PhoneNumber: [phoneOnly, [Validators.required, Validators.pattern(/^\d{6,10}$/)]],
            RoleName: [res.roles?.[0] || '', [Validators.required]],
            IsActive: [res.isActive, Validators.required],
            ImagePath: [res.imagePath],
            ImageFile: [null],

            // Password fields
            CurrentPassword: [''],
            NewPassword: ['', [
              Validators.minLength(8),
              Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/)
            ]],
            ConfirmPassword: ['']
          });

          
        },
        error: (err) =>{ 
          this.isloading=false;
          console.error('Error fetching user:', err)}
      });
    }
  }

  handlePhoneFormatting(): void {
    this.userForm.get('PhoneNumber')!.valueChanges.subscribe((value: string) => {
      if (!value) return;
      let input = value.replace(/[^\d+]/g, '');
      if (input.includes('+') && input.indexOf('+') > 0) {
        input = input.replace(/\+/g, '');
        input = '+' + input;
      }

      let displayValue = input;
      const length = Math.min(4, (displayValue.length > 11 ? displayValue.length - 11 : 1));
      const countryCodeMatch = input.match(new RegExp(`^\\+(\\d{1,${length}})`));
      const countryCode = countryCodeMatch ? countryCodeMatch[0] : '';
      const restNumber = input.slice(countryCode.length);

      if (restNumber.length > 5) {
        displayValue = `${countryCode} ${restNumber.slice(0, 5)} ${restNumber.slice(5)}`;
      } else {
        displayValue = `${countryCode} ${restNumber}`;
      }

      if (displayValue !== value) {
        this.userForm.get('PhoneNumber')!.setValue(displayValue, { emitEvent: false });
      }

      this.cleanedPhoneNumber = input.replace(/\s+/g, '');
    });
  }

  onFileSelected(event: any): void {
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

  updateUser(): void {
    this.isloading=true;
    if (!this.userForm || this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.isloading=false;
      return;
    }

    const formData = new FormData();
    formData.append('Id', this.userId!);
    formData.append('FirstName', this.userForm.get('FirstName')?.value);
    formData.append('LastName', this.userForm.get('LastName')?.value ?? '');
    formData.append('Email', this.userForm.get('Email')?.value);
     formData.append('PhoneNumber', this.userForm.get('CountryCode')?.value+this.userForm.get('PhoneNumber')?.value);
    formData.append('RoleName', this.userForm.get('RoleName')?.value);
    formData.append('IsActive', this.userForm.get('IsActive')?.value.toString());

    if (this.selectedFile) formData.append('ImageFile', this.selectedFile);

    // Add password only if user typed something
    if (this.userForm.get('CurrentPassword')?.value) {
      formData.append('CurrentPassword', this.userForm.get('CurrentPassword')?.value);
      formData.append('NewPassword', this.userForm.get('NewPassword')?.value);
      formData.append('ConfirmPassword', this.userForm.get('ConfirmPassword')?.value);
    }

    this.userService.updateProfile(formData).subscribe({
      next: () => {
        this.isloading=false;
       localStorage.setItem('profileImageUpdated', formData.get('Id')!.toString());
        Swal.fire('Success!', 'Profile updated successfully!', 'success').then(() => {
    // 👇 This forces Angular to reload the current route (component)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/Profile']);
    });
  });
      },
      error: (err) => {
        this.isloading=false;
        console.error('Error updating profile:', err);
        const backendMessage = extractBackendError(err);
        Swal.fire('Profile Update Failed!', backendMessage, 'error');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/Dashboard']);
  }

  togglePasswordVisibility(type: 'current' | 'new' | 'confirm'): void {
    if (type === 'current') this.showCurrentPassword = !this.showCurrentPassword;
    if (type === 'new') this.showNewPassword = !this.showNewPassword;
    if (type === 'confirm') this.showConfirmPassword = !this.showConfirmPassword;
  }

  isInvalid(controlName: string): boolean {
    const control = this.userForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  passwordsDoNotMatch(): boolean {
    const newPass = this.userForm.get('NewPassword')?.value;
    const confirmPass = this.userForm.get('ConfirmPassword')?.value;
    return newPass && confirmPass && newPass !== confirmPass;
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
