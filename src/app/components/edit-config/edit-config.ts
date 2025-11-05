import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { ConfigService } from '../../services/config-service';
import { Config } from '../../interfaces/Configration/Config';
import Swal from 'sweetalert2';
import { extractBackendError } from '../../services/BackendErroeService';

@Component({
  selector: 'app-edit-config',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-config.html',
  styleUrls: ['./edit-config.css']
})
export class EditConfig {

  configForm!: FormGroup;
  configId!: string;
  isloading=false;

  constructor(
    private route: ActivatedRoute,
    private configService: ConfigService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.isloading=true;
    this.configId = this.route.snapshot.paramMap.get('id') || '';
    if (this.configId) {
      this.configService.getUserById(this.configId).subscribe({
        next: (res: Config) => {
          this.isloading=false;
          console.log('Fetched Config:', res);
          this.configForm = this.fb.group({
            id: [this.configId],
            key: [res.key, [Validators.required,Validators.maxLength(50),Validators.pattern(/\S.*\S|\S/)]],
            value: [res.value,[ Validators.required,Validators.maxLength(50),Validators.pattern(/\S.*\S|\S/)]],
            displayOrder: [res.displayOrder, [Validators.required,Validators.pattern(/\S.*\S|\S/)]],
            isActive: [res.isActive]
          });
        },
        error: (err) => {
          this.isloading=false;
          console.error('Error fetching configuration:', err);
        }
      });
      console.log('Config ID from route:',  this.configForm.get('key')?.value);
    }
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

  onSubmit() {
    this.isloading=true;
    if (this.configForm.valid) {
      const formValue: Config = this.configForm.value;
      console.log('Config Form Data:', formValue);

      this.configService.updateUser(this.configId, formValue).subscribe({
        next: (res) => {
          this.isloading=false;
          console.log('Configuration updated successfully:', res);
          Swal.fire({
            title: 'Success!',
            text: 'Configration edited successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.router.navigate(['/Config']);
        },
        error: (err) => {
          this.isloading=false;
          console.error('Error updating configuration:', err);
          const backendMessage = extractBackendError(err);
          
                    Swal.fire({
                      title: 'Configration Edit  Failed!',
                      text: backendMessage,
                      icon: 'error',
                      confirmButtonText: 'Try Again'
              });
        }
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
