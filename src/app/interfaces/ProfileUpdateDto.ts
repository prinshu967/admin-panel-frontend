export interface ProfileUpdateDto {
  id: string; 

  firstName: string;
  lastName?: string;

  email: string;
  phoneNumber?: string;

  
  roleName?: string;

  isActive: boolean;

  imagePath?: string;

 
  imageFile?: File;

  
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}
