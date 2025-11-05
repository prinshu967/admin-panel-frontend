import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { ConfigService } from '../../services/config-service';
import { Config } from '../../interfaces/Configration/Config';
import Swal from 'sweetalert2';
import { extractBackendError } from '../../services/BackendErroeService';


@Component({
  selector: 'app-add-config',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIf],
  templateUrl: './add-config.html',
  styleUrls: ['./add-config.css']
})
export class AddConfig {

  configForm!: FormGroup;
  isloading=false;

  constructor(
    private configService: ConfigService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.configForm = this.fb.group({
    key: ['', [Validators.required,Validators.maxLength(50),Validators.pattern(/\S.*\S|\S/)]],
      value: ['', [Validators.required,Validators.maxLength(50),Validators.pattern(/\S.*\S|\S/)]],
      displayOrder: ['', [Validators.required,Validators.pattern(/\S.*\S|\S/)]],
      isActive: [true]
    });
  }

  // Getters
  get key() { return this.configForm.get('key'); }
  get value() { return this.configForm.get('value'); }
  get displayOrder() { return this.configForm.get('displayOrder'); }
  get isActive() { return this.configForm.get('isActive'); }

  cancel() {
    this.configForm.reset({
      key: '',
      value: '',
      displayOrder: '',
      isActive: true
    });
    this.router.navigate(['/Config']);
  }

  onSubmit(): void {
    this.isloading=true;
    if (this.configForm.valid) {
      const formValue: Config = this.configForm.value;
      console.log('Config Form Data:', formValue);

      this.configService.addUser(formValue).subscribe({
        next: (value) => {
          this.isloading=false;
          console.log('Configuration added successfully:', value);
          Swal.fire({
  title: 'Success!',
  text: 'Configuration added successfully!',
  icon: 'success',
  confirmButtonText: 'OK'
});

          this.router.navigate(['/Config']);
        },
        error: (err) => {
          this.isloading=false;
          console.error('Error adding configuration:', err);
          const backendMessage = extractBackendError(err);

    Swal.fire({
        title: 'Configration Add Failed!',
        text: backendMessage,
        icon: 'error',
        confirmButtonText: 'Try Again'
    });
          
        },
      });
    } else {
      this.isloading=false;
      this.configForm.markAllAsTouched();
    }
  }

  
  limitInput(controlName: string, maxLength: number) {
  const control = this.configForm.get(controlName);
  if (control && control.value && control.value.length > maxLength) {
    control.setValue(control.value.slice(0, maxLength), { emitEvent: false });
  }
}
limitNumberLength(event: any, maxLength: number) {
  const input = event.target as HTMLInputElement;
  if (input.value.length > maxLength) {
    input.value = input.value.slice(0, maxLength);
    this.configForm.get('displayOrder')?.setValue(input.value);
  }
}
}
