import { Component } from '@angular/core';
import { FAQService } from '../../services/faqservice';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { FAQItem } from '../../interfaces/FAQs/FQQ';
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
  selector: 'app-add-faq',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CKEditorModule, NgIf],
  templateUrl: './add-faq.html',
  styleUrls: ['./add-faq.css']
})
export class AddFAQ {
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
  emailForm!: FormGroup;
  isloading = false;

  constructor(
    private faqService: FAQService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.emailForm = this.fb.group({
      question: ['', [Validators.required,Validators.maxLength(50),Validators.pattern(/\S.*\S|\S/)]],
      displayOrder: ['',[ Validators.required,Validators.pattern(/\S.*\S|\S/)]],
      answer: ['', [Validators.required,Validators.pattern(/\S.*\S|\S/)]],
      isActive: [true]
    });
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
    this.isloading = true;
    if (this.emailForm.valid) {
      const formValue: FAQItem = this.emailForm.value;
      console.log('FAQ Form Data:', formValue);

      this.faqService.addFaq(formValue).subscribe({
        next: (value) => {
          this.isloading = false;
          console.log('FAQ added successfully:', value);
          Swal.fire({
  title: 'Success!',
  text: 'FAQ added successfully!',
  icon: 'success',
  confirmButtonText: 'OK'
});

          this.router.navigate(['/FAQ']);
        },
        error: (err) => {
          this.isloading = false;
          console.error('Error adding FAQ:', err);
          const backendMessage = extractBackendError(err);

    Swal.fire({
        title: 'FAQ Add  Failed!',
        text: backendMessage,
        icon: 'error',
        confirmButtonText: 'Try Again'
    });
        },
      });
    } else {
      this.isloading = false;
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

limitNumberLength(event: any, maxLength: number) {
  const input = event.target as HTMLInputElement;
  if (input.value.length > maxLength) {
    input.value = input.value.slice(0, maxLength);
    this.emailForm.get('displayOrder')?.setValue(input.value);
  }
}
}
