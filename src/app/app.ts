import { Component, signal } from '@angular/core';

import { Header } from './components/header/header';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']   
})
export class App {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap(route => route.data)
      )
      .subscribe(data => {
        const pageTitle = data['title']
          ? `${data['title']} | Admin Panel`
          : 'Admin Panel';
        this.titleService.setTitle(pageTitle);
      });
  }
 
}
