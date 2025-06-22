import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { GroupService } from '../../services/group.service';
import { Post } from '../../models/post.model';
import { AsyncPipe } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { User } from '../../models/user.model';
import { Group } from '../../models/group.model';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-post-list',
  imports: [AsyncPipe, RouterLink, ReactiveFormsModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit {
  authenticationService = inject(AuthenticationService);
  userService = inject(UserService);
  groupService = inject(GroupService);
  postService = inject(PostService);
  httpClient = inject(HttpClient);

  user: any = null;
  groups: any[] = [];
  posts: Post[] = [];
  currentGroupName: string = '';
  isLoading = true;
  connectedUser: User | null = null;
  groupFormGroup: FormGroup;


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
          console.log('connectedUser:', this.connectedUser);
          this.userService.getGroupsByUserId(fullUser.id).subscribe(groups => {
            this.groups = groups;
            console.log('Groups:', this.groups);
            if (groups.length > 0) {
              this.groupService.setCurrentGroup(groups[0]);
              this.currentGroupName = groups[0].name;
              this.loadPosts(groups[0].id);  // <- ici tu passes bien l'id
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
    if (!groupId) {
      console.warn("Aucun groupe sélectionné");
      this.posts = [];
      return;
    }

    this.postService.getPostsOfUserGroup(groupId).subscribe({
      next: (response: any) => {
        this.posts = response.member;  // <- ici on prend la propriété member
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
      ownerId: userId,  // ou ce que ton backend attend comme champ
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
