import { Component } from '@angular/core';
import { RoleService } from '../../services/role-service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { extractBackendError } from '../../services/BackendErroeService';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'addrole',
  standalone:true,
  imports: [FormsModule, RouterLink,CommonModule],
  templateUrl: './add-role.html',
  styleUrl: './add-role.css'
})
export class AddRole {
   @ViewChild('roleForm') roleForm!: NgForm; 
  newRole = {
    name: '',
    description: '',
    isActive: true,
    permissions: [] as string[]
  };
  isloading=false;
  constructor(private roleService: RoleService, private router: Router) {}

  isExpanded:boolean=false;
  isCheckedAll:boolean=false;

  allPermissionsGrouped: { [key: string]: string[] } = {
  Users: ["Users.View", "Users.Create", "Users.Edit", "Users.Delete"],
  Roles: ["Roles.View", "Roles.Create", "Roles.Edit", "Roles.Delete"],
  CMS: ["CMS.View", "CMS.Create", "CMS.Edit", "CMS.Delete"],
  EmailTemplate: ["EmailTemplate.View", "EmailTemplate.Create", "EmailTemplate.Edit", "EmailTemplate.Delete"],
  Configuration: ["Configration.View", "Configration.Create", "Configration.Edit", "Configration.Delete"],
  FAQ: ["FAQ.View", "FAQ.Create", "FAQ.Edit", "FAQ.Delete"],
  AuditLog: ["AuditLog.View"]
  
};


// Track which groups are expanded
expandedGroups: { [key: string]: boolean } = {};


  togglePermission(permission: string, event: any) {
    if (event.target.checked) {
      this.newRole.permissions.push(permission);
    } else {
      this.newRole.permissions = this.newRole.permissions.filter(p => p !== permission);
    }
  }

  // Helper to iterate over object keys in *ngFor
objectKeys(obj: any): string[] {
  return Object.keys(obj);
}

// Toggle group open/closed
toggleGroup(group: string) {
  this.expandedGroups[group] = !this.expandedGroups[group];
}



toggleAllGroups() {
  this.isExpanded = !this.isExpanded;
  for (const group of Object.keys(this.allPermissionsGrouped)) {
    this.expandedGroups[group] = this.isExpanded;
  }
}


toggleAllPermissions() {
    this.isCheckedAll = !this.isCheckedAll;

    if (this.isCheckedAll) {
      // Flatten all permission arrays and assign
      this.newRole.permissions = Object.values(this.allPermissionsGrouped).flat();
    } else {
      // Clear all permissions
      this.newRole.permissions = [];
    }
  }

 

  

 

  addRole() {
    if (this.roleForm.invalid) {
    this.roleForm.form.markAllAsTouched(); // ✅ highlight all invalid controls
   
    return; // ⛔ stop here
  }
    this.isloading=true;

    const roleToSend = {
    ...this.newRole,
    permissions: this.newRole.permissions.join(',')  
  };
  console.log(roleToSend);
    this.roleService.addRole(roleToSend).subscribe({
      next: () => {
        this.isloading=false;
        Swal.fire({
  title: 'Success!',
  text: 'Role added successfully!',
  icon: 'success',
  confirmButtonText: 'OK'
});

        this.router.navigate(['/Roles']);
      },
      error: err => {
        this.isloading=false;
        console.error('Error adding role:', err)
        const backendMessage = extractBackendError(err);

    Swal.fire({
        title: 'Role Add Failed!',
        text: backendMessage,
        icon: 'error',
        confirmButtonText: 'Try Again'
    });
      }


    });
  }

  cancel() {
     this.newRole = { name: '', description: '', isActive: true, permissions: [] };
    this.router.navigate(['/Roles']);
  }

}

