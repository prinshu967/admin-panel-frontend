import { Component, ChangeDetectorRef, HostListener } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { LoginSrvice } from '../../services/login-srvice';
import { UserService } from '../../services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'header',
  standalone: true,
  imports: [RouterModule, RouterLink,CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  isloading=false;
  isLoggedIn: boolean = false;
  showLayout: boolean = true;
  toMenu: boolean = true;
  imageUrl = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
  userNmae: string | null = null;
  role: string | null = null;
  toShowProfileDropdown: boolean = false;


  private fetchUserDetails(userId: string): void {
    this.isloading=true;
  this.userService.getProfile().subscribe({
    
    next: (res) => {

      this.isloading=false;
      if (res.imagePath) this.imageUrl = res.imagePath;
      if (res.firstName && res.lastName) this.userNmae = `${res.firstName} ${res.lastName}`;
      if (res.roles && res.roles[0]) this.role = res.roles[0];
     
      console.log(res);
    },
    error: (err) => {
      this.isloading=false;
      
      console.error('Error fetching user:', err)}
  });
}


  constructor(
    public accountService: LoginSrvice,
    private cd: ChangeDetectorRef,
    private router: Router,
    private userService: UserService

  ) {
    this.isLoggedIn = this.accountService.isLoggedIn();
    this.adjustSidebar(window.innerWidth);
  }

  ngDoCheck() {
    const loginState = this.accountService.isLoggedIn();
    const currentUrl = this.router.url.split('?')[0].toLowerCase();

    this.showLayout = !['/login', '/login/forgotpassword', '/login/resetpassword'].includes(currentUrl);
    if (loginState !== this.isLoggedIn) this.isLoggedIn = loginState;

    // const savedImage = localStorage.getItem('imageUrl');
    // if (savedImage) this.imageUrl = savedImage;

    // const name = localStorage.getItem('userName');
    // if (name) this.userNmae = name;

    // const Role = localStorage.getItem('role');
    // if (Role) this.role = Role;

    const isUpdated = localStorage.getItem('profileImageUpdated');
    if (isUpdated) {
      const userId = localStorage.getItem('userId');
      if (userId&& userId === isUpdated) {
        this.fetchUserDetails(userId);
        localStorage.removeItem('profileImageUpdated');
      }




    }
    //Role Permission chageupdate

    const Permission=localStorage.getItem('updatePermission');
    if(Permission){
      if(Permission===this.role){
      this.Logout();}
      localStorage.removeItem('updatePermission')
    }

    // Role name Chage update

    const roleUpdate=localStorage.getItem('roleUpdate');
    if(roleUpdate){
      if(roleUpdate===this.role){
        const userId = localStorage.getItem('userId');
      if (userId) {
        this.fetchUserDetails(userId);
        
      }

      }
      localStorage.removeItem('roleUpdate');
    }


    this.cd.detectChanges();
  }
  ngOnInit(): void {
     const loginState = this.accountService.isLoggedIn();
  
    if (loginState){
       localStorage.setItem('profileImageUpdated', localStorage.getItem('userId')!);

    } 
    
  }

  
 



  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.adjustSidebar(event.target.innerWidth);
  }

 @HostListener('window:click', ['$event'])
onClick(event: MouseEvent){

  this.toShowProfileDropdown=false;
 }



  private adjustSidebar(width: number): void {
   
    this.toMenu = width > 768;
  }

  Logout() {
    this.accountService.logout().subscribe({
      next: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        // localStorage.removeItem('imageUrl');
        this.isLoggedIn = false;
        this.imageUrl = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
        this.router.navigate(['/Login']);
        this.toShowProfileDropdown = false;
      },
      error: err => console.error('Logout failed', err)
    });
  }

  toggleMenu(): void {
     if(window.innerWidth<768){
       this.toMenu=false;
       return;
     }

    this.toMenu = !this.toMenu;
  }

  toggleProfileDropdown(e:Event): void {
    e.stopPropagation();
    this.toShowProfileDropdown = !this.toShowProfileDropdown;
  }

  goToProfile(): void {
    this.toShowProfileDropdown = false;
    this.router.navigate(['/Profile']);
  }
}
 