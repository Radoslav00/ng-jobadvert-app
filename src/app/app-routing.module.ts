import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {LoginCanLoadGuard} from "./auth/guards/login.canLoad.guard";
import {ActivateGuardGuard} from "./auth/guards/activate-guard.guard";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),

  },
  {
    path: 'home',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule),
    canLoad: [LoginCanLoadGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
