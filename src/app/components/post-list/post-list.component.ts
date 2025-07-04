import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { GroupService } from '../../services/group.service';
import { Post } from '../../models/post.model';
import {AsyncPipe, DatePipe, JsonPipe} from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import {Router, RouterLink} from '@angular/router';
import { User } from '../../models/user.model';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-post-list',
  imports: [AsyncPipe, RouterLink, ReactiveFormsModule, DatePipe],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit {
  authenticationService = inject(AuthenticationService);
  userService = inject(UserService);
  groupService = inject(GroupService);
  postService = inject(PostService);
  httpClient = inject(HttpClient);
  router = inject(Router);

  user: any = null;
  groups: any[] = [];
  posts: Post[] = [];
  currentGroupName: string = '';
  isLoading = true;
  connectedUser: User | null = null;
  groupFormGroup: FormGroup;
  inviteForm!: FormGroup;



  constructor() {
    this.groupFormGroup = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    });
  }


  ngOnInit() {
    this.authenticationService.connectedUser.subscribe(user => {
      if (user) {
        this.userService.findById(user.id).subscribe(fullUser => {
          this.connectedUser = fullUser;
          this.userService.getGroupsByUserId(fullUser.id).subscribe(groups => {
            this.groups = groups;

            this.groups.forEach(group => {
              if (typeof group.creator === 'string') {
                const creatorId = this.userService.extractUserIdFromUrl(group.creator);
                if (creatorId) {
                  this.userService.findById(+creatorId).subscribe(user => {
                    group.creator = user;
                  });
                }
              }
            });

            if (this.groups.length > 0) {
              this.groupService.setCurrentGroup(groups[0]);
              this.currentGroupName = groups[0].name;
              this.loadPosts(groups[0].id);
            }
            this.isLoading = false;
            this.inviteForm = new FormGroup({
              email: new FormControl('', [Validators.required, Validators.email])
            });
          });

        });
      } else {
        this.isLoading = false;
      }
    });
  }


  private extractCreatorIdFromUrl(url: string): string | null {
    const match = url.match(/\/api\/users\/(\d+)/);
    return match ? match[1] : null;
  }

  sendInvite() {
    if (this.inviteForm.invalid || this.groups.length === 0) return;

    const email = this.inviteForm.value.email;
    const groupId = this.groups[0].id;

    this.httpClient.post(`/api/groups/${groupId}/invite`, { email }).subscribe({
      next: () => {
        alert(`Invitation envoyée à ${email}`);
        this.inviteForm.reset();
      },
      error: () => {
        alert("Erreur lors de l'envoi de l'invitation");
      }
    });
  }

  loadPosts(groupId: number) {
    if (!groupId) {
      console.warn("Aucun groupe sélectionné");
      this.posts = [];
      return;
    }

    this.postService.getPostsOfUserGroup(groupId).subscribe({
      next: (response: any) => {
        this.posts = response.member;

        for (const post of this.posts) {
          if (typeof post.creator === 'string') {
            const userId = this.userService.extractUserIdFromUrl(post.creator);
            if (userId) {
              this.userService.findById(+userId).subscribe(user => {
                post.creator = user.name;
              });
            }
          }
        }
      },
      error: err => {
        console.error("Erreur lors du chargement des posts", err);
      }
    });
  }



  createGroup() {
    if (this.groupFormGroup.invalid) return;

    const userId = this.authenticationService.getCurrentPersonId();
    const newGroup = {

      name: this.groupFormGroup.value.name,
    };

    this.groupService.save(newGroup).subscribe({
      next: (savedGroup) => {
        this.groups.push(savedGroup);
        this.groupFormGroup.reset();
      },
      error: (err) => console.error('Erreur création groupe', err)
    });
  }

}
