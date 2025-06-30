import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { GroupService } from './services/group.service';
import { PostService } from './services/post.service';
import { Post } from './models/post.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  authenticationService = inject(AuthenticationService);
  groupService = inject(GroupService);
  userService = inject(UserService);
  postService = inject(PostService);
  title = 'latribu_Frontend';
  router = inject(Router);


  groups: any[] = [];
  userId: number | null = null;

  userPicture: string | null = null;
  // connectedUser: any = null;

  constructor() {


  }



  onPhotoError(event: Event) {
    (event.target as HTMLImageElement).src = '/users-picture/chicken.png';
  }

}
