import { Component, OnInit } from '@angular/core';
import { User } from "../_domains/user";
import { TokenStorageService } from "../_services/token-storage.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public userInfo: User = new User();

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.userInfo = this.tokenStorageService.getUser();
  }

}
