import { Component ,ViewChild} from '@angular/core';
import { RoleService } from '../../services';
import { EditRole } from '../../interfaces/Roles/EditRole';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule,NgForm } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { extractBackendError } from '../../services/BackendErroeService';


@Component({
  selector: 'app-edit-role',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, NgIf],
  templateUrl: './edit-role.html',
  styleUrls: ['./edit-role.css']
})
export class EditRoleComponent {
   @ViewChild('roleForm') roleForm!: NgForm; 
  isExpanded:boolean=false;
  isCheckedAll:boolean=false;
  roleId: string = '';
  role:string='';
  isloading=false;
 rolepermissions: string[] = [];

  newRole = {
    name: '',
    description: '',
    isActive: true,
    permissions: [] as string[]
  };

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

  constructor(
    private route: ActivatedRoute,
    private roleService: RoleService,
    private router: Router
  ) {}

  // Helper to iterate over object keys in *ngFor
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  // Toggle group open/closed
  toggleGroup(group: string) {
    this.expandedGroups[group] = !this.expandedGroups[group];
  }

  togglePermission(permission: string, event: any) {
    if (event.target.checked) {
      if (!this.newRole.permissions.includes(permission)) {
        this.newRole.permissions.push(permission);
      }
    } else {
      this.newRole.permissions = this.newRole.permissions.filter(p => p !== permission);
    }
  }

  ngOnInit(): void {
    this.isloading=true;
    this.roleId = this.route.snapshot.paramMap.get('id') || '';
    if (this.roleId) {

      this.roleService.getRoleById(this.roleId).subscribe({
        next: (res: EditRole) => {
          this.isloading=false;
          this.newRole.name = res.name;
          this.newRole.description = res.description;
          this.newRole.isActive = res.isActive;
          this.newRole.permissions = res.permissions
  ? Array.from(new Set(res.permissions.split(',').map(p => p.trim())))
  : [];

          console.log(`Response: ${res.permissions}`)
          console.log(`Current: ${this.newRole.permissions}`)
          this.role=res.name;
          this.rolepermissions = JSON.parse(JSON.stringify(this.newRole.permissions));

        },
        error: (err: any) => {
          this.isloading=false;
          console.error('Error fetching role:', err)}
      });
    }
  }

  updateRole() {
     if (this.roleForm.invalid) {
    this.roleForm.form.markAllAsTouched(); 
   
    return; 
  }
    this.isloading=true;
    const roleToSend: EditRole = {
    id: this.roleId,               
    name: this.newRole.name,
    description: this.newRole.description,
    isActive: this.newRole.isActive,
    permissions: this.newRole.permissions.join(',')  
  };
  console.log(roleToSend);

    this.roleService.updateRole(this.roleId, roleToSend).subscribe({
      
      next: () => {
        this.isloading=false;
        Swal.fire({
          title: 'Success!',
          text: 'Role edited successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
       if (JSON.stringify(this.rolepermissions) !== JSON.stringify(this.newRole.permissions)) {
  localStorage.setItem('updatePermission', this.role);
}

   if(this.role!==this.newRole.name){
     localStorage.setItem('roleUpdate', this.role);
   }


        this.router.navigate(['/Roles']);
      },
      error: (err: any) => {
        this.isloading=false;
        console.error('Error updating role:', err)

        const backendMessage = extractBackendError(err);
        
                  Swal.fire({
                    title: 'Role Edit Failed!',
                    text: backendMessage,
                    icon: 'error',
                    confirmButtonText: 'Try Again'
            });
      }
    });
  }

  onCancel() {
    this.router.navigate(['/Roles']);
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
}
