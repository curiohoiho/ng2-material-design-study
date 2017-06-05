import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// ??
import { RouterModule, Routes } from '@angular/router';


import { Configuration } from './app.constants';
// import { AppRoutes } from './app.routes';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

// import { SharedModule } from './shared/shared.module';
// import { CoreModule } from './core/core.module';

import { PagesModule } from './pages/pages.module';
import { LibModule } from './lib/lib.module';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'about', loadChildren: './about/about.module#AboutModule' },
  // { path: 'button', loadChildren: '' }
];


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    // AppRoutes,
    // SharedModule,
    // CoreModule.forRoot(),
    RouterModule.forRoot(routes)

    // PagesModule,
    // LibModule
  ],

    declarations: [
      AppComponent,
      HomeComponent
    ],

    providers: [
      { provide: LocationStrategy, useClass: HashLocationStrategy }
    ]

    bootstrap: [AppComponent],
})

export class AppModule { }