import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
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


  groups: any[] = [];
  userId: number | null = null;
  posts: Post[] = [];

  userPicture: string | null = null;
  // connectedUser: any = null;

  constructor() {
    // On écoute la personne connectée
    this.authenticationService.connectedPerson.subscribe(person => {
      if (person) {
        // On récupère ses infos (dont la photo)
        this.userService.findById(person.id).subscribe(user => {
          this.userPicture = this.userService.getPhotoUrl(user);;
          // this.connectedUser = user;
          this.userService.getGroupsByUserId(person.id).subscribe(groups => {
            this.groups = groups;

            if (groups.length > 0) {
              // Charger les posts du premier groupe
              console.log("il y a bien un groupe")
              this.groupService.setCurrentGroup(groups[0]);
              const groupId = groups[0].id;
              this.loadPosts(groupId);
            }
          });
        });
      }
    });

  }

  loadPosts(groupId: number) {
    this.postService.getPostsOfUserGroup().subscribe({
      next: posts => {
        this.posts = posts;
      },
      error: err => {
        console.error("Erreur récupération posts du groupe", err);
        this.posts = [];
      }
    });
  }

  onPhotoError(event: Event) {
    (event.target as HTMLImageElement).src = '/users-picture/chicken.png';
  }

}
