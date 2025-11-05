import { Component } from '@angular/core';
import { EmailTemplateService } from '../../services/EmailTemplateService';
import { FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { emailTemplate } from '../../interfaces/EmailTemplate/EmailTemplate';
import { CommonModule, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { extractBackendError } from '../../services/BackendErroeService';

import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Paragraph,
  Underline,
  Strikethrough,
  Link,
  BlockQuote,
  Undo,
  Heading,
  List,
  Indent,
  IndentBlock,
  Alignment,
  Font,
  Highlight,
  RemoveFormat,
  Table,
  TableToolbar,
  ImageUpload,
  ImageInsert,
  AutoImage,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  SourceEditing,
  GeneralHtmlSupport
  
} from 'ckeditor5';


@Component({
  selector: 'app-add-email-template',
  imports: [ReactiveFormsModule,CommonModule,CKEditorModule,NgIf],
  templateUrl: './add-email-template.html',
  styleUrl: './add-email-template.css'
})
export class AddEmailTemplate {
  isloading=false;

public Editor:any=ClassicEditor;
  emailForm!:FormGroup;
   public config: any = {
    licenseKey: 'GPL',
    plugins: [
      SourceEditing,
      Essentials,
      Paragraph,
      Bold,
      Italic,
      Underline,
      Strikethrough,
      Link,
      BlockQuote,
      Undo,
      Heading,
      List,
      Indent,
      IndentBlock,
      Alignment,
      Font,
      Highlight,
      RemoveFormat,
      Table,
      TableToolbar,
      Image,
      ImageCaption,
      ImageStyle,
      ImageToolbar,
      ImageInsert,
      ImageUpload,
      AutoImage,
      GeneralHtmlSupport
    ],
    toolbar: [
      'sourceEditing',
      'undo', 'redo', '|',
      'heading', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
      'link', 'blockQuote', '|',
      'bulletedList', 'numberedList', '|',
      'outdent', 'indent', 'alignment', '|',
      'insertTable', 'insertImage', '|',
      'highlight', 'removeFormat'
    ],
    placeholder: 'Type your email content here...',
    htmlSupport: {
    allow: [
      {
        name: /.*/,
        attributes: true,
        classes: true,
        styles: true
      }
    ]
  }
  };
  constructor(private EmailService:EmailTemplateService,private fb:FormBuilder,private router:Router){
    

  }
  ngOnInit() {
  this.emailForm = this.fb.group({
  key: ['', [
    Validators.required,
    Validators.maxLength(50),
    Validators.pattern(/\S.*\S|\S/)
  ]],
  title: ['', [
    Validators.required,
    Validators.maxLength(50),
    Validators.pattern(/\S.*\S|\S/)
  ]],
  subject: ['', [
    Validators.required,
    Validators.maxLength(100),
    Validators.pattern(/\S.*\S|\S/)
  ]],
  
  fromName: ['', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50),
    Validators.pattern(/\S.*\S|\S/)
  ]],
  fromEmail: ['', [
    Validators.required,
    Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    Validators.maxLength(100)
  ]],
  isManualMail: [false],
  isContactUsMail: [false],
  body: [null, Validators.required],
  isActive: [true]
});

}

cancel() {
  this.emailForm.reset({
    key: '',
    title: '',
    subject: '',
    fromName: '',
    fromEmail: '',
    isManualMail: false,
    isContactUsMail: false,
    body: null,
    isActive: true
  });
  this.router.navigate(['/EmailTemplates']);
}

//  Getters matching form controls
get key() {
  return this.emailForm.get('key');
}

get title() {
  return this.emailForm.get('title');
}

get subject() {
  return this.emailForm.get('subject');
}

get fromName() {
  return this.emailForm.get('fromName');
}

get fromEmail() {
  return this.emailForm.get('fromEmail');
}

get isManualMail() {
  return this.emailForm.get('isManualMail');
}

get isContactUsMail() {
  return this.emailForm.get('isContactUsMail');
}

get body() {
  return this.emailForm.get('body');
}

get isActive() {
  return this.emailForm.get('isActive');
}


  onSubmit(): void {
    this.isloading=true;
    if (this.emailForm.valid) {
      const formValue:emailTemplate  = this.emailForm.value;
      console.log(' Email Template Form Data:', formValue);
      this.EmailService.add(formValue).subscribe({
        next:(value)=> {
          this.isloading=false;
          console.log(value);
          Swal.fire({
  title: 'Success!',
  text: 'Email Template added successfully!',
  icon: 'success',
  confirmButtonText: 'OK'
});

          this.router.navigate(['/EmailTemplates']); 

          
        },
        error:(err)=> {
          this.isloading=false;
          console.log(err);

          const backendMessage = extractBackendError(err);

    Swal.fire({
        title: 'Enail Template Add Failed!',
        text: backendMessage,
        icon: 'error',
        confirmButtonText: 'Try Again'
    });
        },
      })
      
    } else {
      this.isloading=false;
      this.emailForm.markAllAsTouched();
      Swal.fire({
               icon: 'error',                
               title: 'Invalid Form',              
               text: 'Please fill out all required fields correctly.',
               showConfirmButton: true,
               confirmButtonText: 'OK',
               confirmButtonColor: '#e74c3c', // red button
               background: '#fff'
            });
    }
  }

  limitInput(controlName: string, maxLength: number) {
  const control = this.emailForm.get(controlName);
  if (control && control.value && control.value.length > maxLength) {
    control.setValue(control.value.slice(0, maxLength), { emitEvent: false });
  }
  control?.setValue(control?.value.trimStart());
}

}
