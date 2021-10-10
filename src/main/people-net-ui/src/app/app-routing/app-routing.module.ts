import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "../login/login.component";
import {HomeComponent} from "../home/home.component";
import {RegisterComponent} from "../register/register.component";
import {ProfileComponent} from "../profile/profile.component";
import {AuthGuard} from "../_helpers/auth.guard";

const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    // home route protected by auth guard.
    {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
    // profile route protected by auth guard.
    {path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard]},
    {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
    {path: '**', redirectTo: 'home'},
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
