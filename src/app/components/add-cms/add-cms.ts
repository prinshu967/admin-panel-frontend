import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CMSService } from '../../services/cmsservice';
import { cmsAdd } from '../../interfaces/CMSs/Add';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { extractBackendError } from '../../services/BackendErroeService';
// Keep this (correct import):

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
  selector: 'app-add-cms',
  imports: [FormsModule,CKEditorModule,CommonModule,ReactiveFormsModule],
  templateUrl: './add-cms.html',
  styleUrl: './add-cms.css'
})
export class AddCMS {
  public Editor:any=ClassicEditor;
  cmsForm!:FormGroup
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
      placeholder: 'Type your  content here...',
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
  isloading=false;
  constructor(private cmsService:CMSService,private fb:FormBuilder,private router:Router){
    

  }
  ngOnInit(){
    this.cmsForm = this.fb.group({
      key: ['', [Validators.required,  Validators.maxLength(50),Validators.pattern(/\S.*\S|\S/)]],
      title: ['', [Validators.required,  Validators.maxLength(50),Validators.pattern(/\S.*\S|\S/)]],
      metaKeyword: ['',[Validators.required,  Validators.maxLength(50),Validators.pattern(/\S.*\S|\S/)]],
      metaTitle: ['',[Validators.required,  Validators.maxLength(50),Validators.pattern(/\S.*\S|\S/)]],
      metaDescription: ['',[Validators.required,  Validators.maxLength(100),Validators.pattern(/\S.*\S|\S/)]],
      content: [null, Validators.required],
      isActive: [true]
    });

    
  }
  limitInput(controlName: string, maxLength: number) {
  const control = this.cmsForm.get(controlName);
  if (control && control.value && control.value.length > maxLength) {
    control.setValue(control.value.slice(0, maxLength), { emitEvent: false });
  }
}

  cancel(){
  this.cmsForm.reset({
    key: '',
    title: '',
    metaKeyword: '',
    metaTitle: '',
    metaDescription: '',
    content: null,
    isActive: true
  });
  this.router.navigate(['/CMS']);


}

  get key(){
    return this.cmsForm.controls['key'];
  }
  get title(){
    return this.cmsForm.controls['title'];
  }

  get metaKeyword(){
    return this.cmsForm.controls['metaKeyword'];
  }
  get metaTitle(){
    return this.cmsForm.controls['metaTitle'];
  }
  get metaDescription(){
    return this.cmsForm.controls['metaDescription'];
  }
  get content(){
    return this.cmsForm.controls['content'];
  }
  get isActive(){
    return this.cmsForm.controls['isActive'];
  }

  onSubmit(): void {
    this.isloading=true;
    if (this.cmsForm.valid) {
      const formValue: cmsAdd = this.cmsForm.value;
      console.log(' CMS Form Data:', formValue);
      this.cmsService.addCMS(formValue).subscribe({
        next:(value)=> {
          this.isloading=false;
          console.log(value);
          Swal.fire({
  title: 'Success!',
  text: 'CMS added successfully!',
  icon: 'success',
  confirmButtonText: 'OK'
});

          this.router.navigate(['/CMS']); 

          
        },
        error:(err)=> {
          this.isloading=false;
          console.log(err);
          const backendMessage = extractBackendError(err);

          Swal.fire({
            title: 'CMS Add Failed!',
            text: backendMessage,
            icon: 'error',
            confirmButtonText: 'Try Again'
    });

          
        },
      })
      
    } else {
      this.isloading=false;
      this.cmsForm.markAllAsTouched();
    }
  }

}
