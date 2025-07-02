import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { GroupService } from './services/group.service';
import { PostService } from './services/post.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  authenticationService = inject(AuthenticationService);
  title = 'latribu_Frontend';
  router = inject(Router);


  groups: any[] = [];
  userPicture: string | null = null;


  onPhotoError(event: Event) {
    (event.target as HTMLImageElement).src = '/users-picture/chicken.png';
  }

}
