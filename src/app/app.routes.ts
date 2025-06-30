import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { PostComponent } from './components/post/post.component';
import { PostListComponent } from './components/post-list/post-list.component';
import {ManageUsersComponent} from './components/manage-users/manage-users.component';
import {authGuard} from './auth.guard';

export const routes: Routes = [
    { path: '', component: PostListComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'post', component: PostComponent },
    { path: 'manage-users', component: ManageUsersComponent, canActivate: [authGuard] },
    { path: 'post', component: PostComponent, canActivate: [authGuard] }

];
