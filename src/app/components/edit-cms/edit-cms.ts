import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { CMSService } from '../../services/cmsservice';
import { cmsAdd } from '../../interfaces/CMSs/Add';
import { ActivatedRoute, Router } from '@angular/router';
import { CMS } from '../../interfaces/CMSs/cms';
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
  selector: 'app-edit-cms',
  imports: [FormsModule,CKEditorModule,CommonModule,ReactiveFormsModule],
  templateUrl: './edit-cms.html',
  styleUrl: './edit-cms.css'
})
export class EditCMS {
  cmsId!:string
  isloading=false;

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
        placeholder: 'Type your content here...',
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
    constructor(private route:ActivatedRoute, private cmsService:CMSService,private fb:FormBuilder,private router:Router){
      
  
    }
    ngOnInit(){
      this.cmsId = this.route.snapshot.paramMap.get('id') || '';

       if (this.cmsId) {
            this.cmsService.getCMSById(this.cmsId).subscribe({
              next: (res: CMS) => {

                this.cmsForm = this.fb.group({
                id:[this.cmsId],
                key: [res.key, [Validators.required,  Validators.maxLength(50),Validators.pattern(/\S.*\S|\S/)]],
                title: [res.title,[Validators.required,  Validators.maxLength(50),Validators.pattern(/\S.*\S|\S/)]],
                metaKeyword: [res.metaKeyword,[Validators.required,  Validators.maxLength(50),Validators.pattern(/\S.*\S|\S/)]],
                metaTitle: [res.metaTitle,[Validators.required,  Validators.maxLength(50),Validators.pattern(/\S.*\S|\S/)]],
                metaDescription: [res.metaDescription,[Validators.required,  Validators.maxLength(100),Validators.pattern(/\S.*\S|\S/)]],
                content: [res.content, Validators.required],
                isActive: [res.isActive,Validators.required]
      });
  
                 
              },
              error: (err: any) => console.error('Error fetching user:', err) 
            });
          }

     

    
      
      
    }
    limitInput(controlName: string, maxLength: number) {
  const control = this.cmsForm.get(controlName);
  if (control && control.value && control.value.length > maxLength) {
    control.setValue(control.value.slice(0, maxLength), { emitEvent: false });
  }
  control?.setValue(control?.value.trimStart());
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
    get id(){
      return this.cmsForm.controls['id'];
    }

    
 
  
    onSubmit(): void {
      this.isloading=true;
      if (this.cmsForm.valid) {
        const formValue: CMS = this.cmsForm.value;
        console.log(' CMS Form Data:', formValue);
        this.cmsService.updateCMS(this.id.value,formValue).subscribe({
          next:(value)=> {
            this.isloading=false;
            console.log(value);
            Swal.fire({
  title: 'Success!',
  text: 'CMS edited successfully!',
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
                        title: 'CMS Edit Failed!',
                        text: backendMessage,
                        icon: 'error',
                        confirmButtonText: 'Try Again'
                });
          },
        })
        
      } else {
        this.isloading=false;
        this.cmsForm.markAllAsTouched();

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
