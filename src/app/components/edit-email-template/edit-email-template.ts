import { Component } from '@angular/core';
import { EmailTemplateService } from '../../services/EmailTemplateService';
import { FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


import { emailTemplate } from '../../interfaces/EmailTemplate/EmailTemplate';
import { CommonModule } from '@angular/common';
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
  selector: 'app-edit-email-template',
  imports: [FormsModule,CKEditorModule,CommonModule,ReactiveFormsModule],
  templateUrl: './edit-email-template.html',
  styleUrl: './edit-email-template.css'
})
export class EditEmailTemplate {
  public Editor:any=ClassicEditor;
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
  templateId!:string
  emailForm!:FormGroup;
  isloading=false;
  constructor(private route:ActivatedRoute,private EmailService:EmailTemplateService,private fb:FormBuilder,private router:Router){
    

  }
  ngOnInit() {
    this.isloading=true;
       this.emailForm = this.fb.group({
          id: [null],

          key: [null
           
          ],

          title: [null
           
          ],

          subject: [null
            
          ],

          fromName: [
            null
            
          ],

          fromEmail: [
            null
           
          ],

          isManualMail: [null],
           isContactUsMail: [null],
          body: [null],
          isActive: [null]
        });
  this.templateId = this.route.snapshot.paramMap.get('id') || '';

  if (this.templateId) {
    this.EmailService.getById(this.templateId).subscribe({
      next: (res: emailTemplate) => {
        this.isloading=false;
        this.emailForm = this.fb.group({
          id: [res.id],

          key: [
            res.key,
            [
              Validators.required,
              Validators.maxLength(50),
              Validators.pattern(/\S.*\S|\S/)
            ]
          ],

          title: [
            res.title,
            [
              Validators.required,
              Validators.maxLength(50),
              Validators.pattern(/\S.*\S|\S/)
            ]
          ],

          subject: [
            res.subject,
            [
              Validators.required,
              Validators.maxLength(50),
              Validators.pattern(/\S.*\S|\S/)
            ]
          ],

          fromName: [
            res.fromName || '',
            [
              Validators.required,
              Validators.minLength(2),
              Validators.maxLength(50),
              Validators.pattern(/\S.*\S|\S/)
            ]
          ],

          fromEmail: [
            res.fromEmail || '',
            [
              Validators.required,
              Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
              Validators.maxLength(100)
            ]
          ],

          isManualMail: [res.isManualMail ?? false],
          isContactUsMail: [res.isContactUsMail ?? false],
          body: [res.body, Validators.required],
          isActive: [res.isActive ?? true]
        });
      },
      error: (err: any) => {
        this.isloading=false;
        
        console.error('Error fetching template:', err);
      }
    });
  }
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
        if (this.emailForm.valid) {
          const formValue: emailTemplate = this.emailForm.value;
          console.log(' CMS Form Data:', formValue);
          this.EmailService.update(this.templateId,formValue).subscribe({
            next:(value)=> {
              console.log(value);
              Swal.fire({
                title: 'Success!',
                text: 'Email Template edited successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
              });
              this.router.navigate(['/EmailTemplates']); 
    
              
            },
            error:(err)=> {
              console.log(err);
              const backendMessage = extractBackendError(err);
              
                        Swal.fire({
                          title: 'Email Template  Failed!',
                          text: backendMessage,
                          icon: 'error',
                          confirmButtonText: 'Try Again'
                  });
            },
          })
          
        } else {
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
