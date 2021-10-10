import {Component, OnInit} from '@angular/core';
import {User} from "../_domains/user";
import {TokenStorageService} from "../_services/token-storage.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProfileService} from "../_services/profile.service";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    public userInfo: User = new User();

    constructor(
        private tokenStorageService: TokenStorageService,
        private profileService: ProfileService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        // we load profile from the state if the CURRENT user is trying to view his profile.
        // we load profile from the server if the current user is trying to view SOMEONE ELSE'S profile.
        let id = Number(this.route.snapshot.paramMap.get('id'));

        if (id && id !== this.tokenStorageService.getUser().id) {
            this.profileService.get(id).subscribe(
                (data: User) => {
                    this.userInfo = data;
                }
            )
        }
        else {
            this.userInfo = this.tokenStorageService.getUser();
        }
    }

    public isMyProfile(): boolean {
        return this.userInfo.id === this.tokenStorageService.getUser().id;
    }

    public isISubscribed() {
        return this.userInfo.subscribers && this.userInfo.subscribers.find((subscriberId: number) => subscriberId === this.tokenStorageService.getUser().id);
    }

    public async changeSubscription() {
        this.userInfo = await this.profileService.changeSubscription(this.userInfo).toPromise();
    }
}
