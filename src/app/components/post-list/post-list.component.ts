import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { GroupService } from '../../services/group.service';
import { Post } from '../../models/post.model';
import { AsyncPipe } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-post-list',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit {
  authenticationService = inject(AuthenticationService);
  userService = inject(UserService);
  groupService = inject(GroupService);
  postService = inject(PostService);

  person: any = null;
  groups: any[] = [];
  posts: Post[] = [];
  currentGroupName: string = '';
  isLoading = true;
  connectedUser: User | any = null;

  ngOnInit() {
    this.authenticationService.connectedPerson.subscribe(person => {
      if (person) {
        this.userService.findById(person.id).subscribe(user => {
          this.connectedUser = user;
          this.person = person;
          this.userService.getGroupsByUserId(person.id).subscribe(groups => {
            this.groups = groups;
            if (groups.length > 0) {
              this.groupService.setCurrentGroup(groups[0]);
              this.currentGroupName = groups[0].name;
              this.loadPosts(groups[0].id);
            }
            this.isLoading = false;
          });
        });
      } else {
        this.isLoading = false;
      }
    });
  }
  loadPosts(groupId: number) {
    this.postService.getPostsOfUserGroup().subscribe({
      next: posts => this.posts = posts,
      error: err => {
        console.error("Erreur lors du chargement des posts", err);
        this.posts = [];
      }
    });
  }
}