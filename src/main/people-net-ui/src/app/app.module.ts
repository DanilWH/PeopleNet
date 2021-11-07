import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { authInterceptorProvider } from "./_helpers/auth.interceptor";
import { NgRedux, NgReduxModule } from "@angular-redux/store";
import { IAppState, INITIAL_STATE, rootReducer } from "./_store/store";
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        HomeComponent,
        ProfileComponent,
        SubscriptionsComponent
    ],
    imports: [
        BrowserModule,

        HttpClientModule,
        FormsModule,
        AppRoutingModule,
        NgReduxModule
    ],
    providers: [authInterceptorProvider],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(ngRedux: NgRedux<IAppState>) {
        ngRedux.configureStore(rootReducer, INITIAL_STATE);
    }
}
