import { Routes, RouterModule } from '@angular/router';

// import { MdButton } from './lib/button/button';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'about', loadChildren: './about/about.module#AboutModule' },
  // { path: 'button', loadChildren: '' }
];

export const AppRoutes = RouterModule.forRoot(routes);
