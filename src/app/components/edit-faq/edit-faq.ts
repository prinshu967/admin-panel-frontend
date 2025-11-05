import { Component } from '@angular/core';
import { FAQService } from '../../services/faqservice';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FAQItem } from '../../interfaces/FAQs/FQQ';
import { CommonModule, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-edit-faq',
  imports: [ReactiveFormsModule, CommonModule, CKEditorModule],
  templateUrl: './edit-faq.html',
  styleUrl: './edit-faq.css'
})
export class EditFAQ {
public Editor: any = ClassicEditor;
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
    placeholder: 'Type your Answer here...',
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

  constructor(
    private route:ActivatedRoute,
    private faqService: FAQService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
     this.emailForm = this.fb.group({
      id:[null,[Validators.required,Validators.pattern(/\S.*\S|\S/)]],
      question: [null,[ Validators.required,Validators.maxLength(50),Validators.pattern(/\S.*\S|\S/)]],
      displayOrder: [null, [Validators.required,Validators.pattern(/\S.*\S|\S/)]],
      answer: [null,[ Validators.required,Validators.pattern(/\S.*\S|\S/)]],
      isActive: [null]
    });
    this.isloading=true;
    this.templateId= this.route.snapshot.paramMap.get('id') || '';
    if (this.templateId) {
    this.faqService.getFaqById(this.templateId).subscribe({
      next:(res)=>{
        this.isloading=false;
        this.emailForm = this.fb.group({
      id:[this.templateId,[Validators.required,Validators.pattern(/\S.*\S|\S/)]],
      question: [res.question,[ Validators.required,Validators.maxLength(50),Validators.pattern(/\S.*\S|\S/)]],
      displayOrder: [res.displayOrder, [Validators.required,Validators.pattern(/\S.*\S|\S/)]],
      answer: [res.answer,[ Validators.required,Validators.pattern(/\S.*\S|\S/)]],
      isActive: [res.isActive]
    });

      },
      error:(err)=>{
        this.isloading=false;
        console.error('Error fetching FAQ:', err);

      }
    })
  }
}

  limitInput(controlName: string, maxLength: number) {
  const control = this.emailForm.get(controlName);
  if (control && control.value && control.value.length > maxLength) {
    control.setValue(control.value.slice(0, maxLength), { emitEvent: false });
  }
  control?.setValue(control?.value.trimStart());
}

limitNumberLength(event: any, maxLength: number) {
  const input = event.target as HTMLInputElement;
  if (input.value.length > maxLength) {
    input.value = input.value.slice(0, maxLength);
    this.emailForm.get('displayOrder')?.setValue(input.value);
  }
}
  cancel() {
    this.emailForm.reset({
      question: '',
      displayOrder: '',
      answer: '',
      isActive: true
    });
    this.router.navigate(['/FAQ']);
  }

  // Getters
  get question() {
    return this.emailForm.get('question');
  }
  get answer() {
    return this.emailForm.get('answer');
  }
  get displayOrder() {
    return this.emailForm.get('displayOrder');
  }
  get isActive() {
    return this.emailForm.get('isActive');
  }

  onSubmit(): void {
    if (this.emailForm.valid) {
      const formValue: FAQItem = this.emailForm.value;
      console.log('FAQ Form Data:', formValue);

      this.faqService.updateFaq(this.templateId,formValue).subscribe({
        next: (value) => {
          console.log('FAQ added successfully:', value);
          Swal.fire({
            title: 'Success!',
            text: 'FAQ edited successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.router.navigate(['/FAQ']);
        },
        error: (err) => {
         

          
          const backendMessage = extractBackendError(err);
          
                    Swal.fire({
                      title: 'FAQ Edit Failed!',
                      text: backendMessage,
                      icon: 'error',
                      confirmButtonText: 'Try Again'
              });
        },
      });
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
}
