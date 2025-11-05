import { Routes } from '@angular/router';
import { Users } from './components/users/users';
import { Roles } from './components/roles/roles';
import {CMSComponent } from './components/cms/cms';
import { EmailTemplate } from './components/email-template/email-template';
import { Login } from './components/login/login';
import { Component } from '@angular/core';
import { AddUser } from './components/add-user/add-user';
import { EditUser } from './components/edit-user/edit-user';
import { AuthGuard } from './auth-guard';
import { ForgettenPassword } from './components/forgetten-password/forgetten-password';
import { ResetPassword } from './components/reset-password/reset-password';
import { AddRole } from './components/add-role/add-role';
import { EditRoleComponent } from './components/edit-role/edit-role';
import { EditCMS } from './components/edit-cms/edit-cms';
import { AddCMS } from './components/add-cms/add-cms';
import { AddEmailTemplate } from './components/add-email-template/add-email-template';
import { EditEmailTemplate } from './components/edit-email-template/edit-email-template';
import { Configrations } from './components/configrations/configrations';
import { AuditLogs } from './components/audit-logs/audit-logs';
import { FAQ } from './components/faq/faq';
import { EditFAQ } from './components/edit-faq/edit-faq';
import { AddFAQ } from './components/add-faq/add-faq';
import { AddConfig } from './components/add-config/add-config';
import { EditConfig } from './components/edit-config/edit-config';
import { Dashboard } from './components/dashboard/dashboard';
import { ProfileComponent } from './components/profile/profile';

export const routes: Routes = [
 
   { path: 'Login', component: Login ,data: { title: 'Login' }},
    { path: 'Dashboard', component: Dashboard, canActivate: [AuthGuard] ,data: { title: 'Dashboard' }},
   
  { path: 'Users', component: Users, canActivate: [AuthGuard] ,data: { title: 'Users' } },
 
  { path: 'Roles', component: Roles, canActivate: [AuthGuard],data: { title: 'Roles' } },
  { path: 'CMS', component: CMSComponent, canActivate: [AuthGuard] ,data: { title: 'CMS' }},
  { path: 'Users/edit/:id', component: EditUser, canActivate: [AuthGuard],data: { title: 'Edit User' } },
  { path: 'Users/add', component: AddUser, canActivate: [AuthGuard] ,data: { title: 'Add User' }},
   { path: 'Roles/add', component: AddRole, canActivate: [AuthGuard],data: { title: 'Add Roles' } },
   { path: 'Roles/edit/:id', component: EditRoleComponent, canActivate: [AuthGuard],data: { title: 'Edit Roles' } },
   { path: 'CMS/edit/:id', component: EditCMS, canActivate: [AuthGuard],data: { title: 'Edit CMS' } },
   { path: 'CMS/add', component: AddCMS, canActivate: [AuthGuard],data: { title: 'Add CMS' } },
  { path: 'EmailTemplates', component: EmailTemplate, canActivate: [AuthGuard] ,data: { title: 'EmailTemplates' }},
  { path: 'EmailTemplates/edit/:id', component: EditEmailTemplate, canActivate: [AuthGuard],data: { title: 'Edit EmailTemplates' } },
   { path: 'EmailTemplates/add', component: AddEmailTemplate, canActivate: [AuthGuard] ,data: { title: 'Add EmailTemplates' }},
  { path: 'Config', component: Configrations, canActivate: [AuthGuard] ,data: { title: 'Configs' }},
  { path: 'AuditLogs', component: AuditLogs, canActivate: [AuthGuard] ,data: { title: 'AuditLogs' }},
   { path: 'FAQ', component: FAQ, canActivate: [AuthGuard] ,data: { title: 'FAQ' }},
   { path: 'FAQ/edit/:id', component: EditFAQ, canActivate: [AuthGuard],data: { title: 'Edit FAQ' } },
   { path: 'FAQ/add', component: AddFAQ, canActivate: [AuthGuard] ,data: { title: 'Add FAQ' }},
   { path: 'Config/edit/:id', component: EditConfig, canActivate: [AuthGuard] ,data: { title: 'Edit Configs' }},
   { path: 'Config/add', component: AddConfig, canActivate: [AuthGuard],data: { title: 'Add Configs' } },
   {path:'Profile', component:ProfileComponent, canActivate: [AuthGuard],data: { title: 'Profile' }},
  {path:'Login/forgotpassword', component:ForgettenPassword,data: { title: 'Forgot Password' }},
  {path:'Login/resetpassword',component:ResetPassword,data: { title: 'Reset Password' }},

  { path: '', redirectTo: 'Login', pathMatch: 'full' }

];
