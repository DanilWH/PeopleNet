import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserSubscription} from '../_domains/userSubscription';
import { ProfileService } from '../_services/profile.service';
import { TokenStorageService } from "../_services/token-storage.service";

@Component({
    selector: 'app-subscriptions',
    templateUrl: './subscriptions.component.html',
    styleUrls: ['./subscriptions.component.css'],
})
export class SubscriptionsComponent implements OnInit {
    public userSubscriptions: UserSubscription[] = [];
    public isCurrentUser: boolean;

    constructor(
        private profileService: ProfileService,
        private tokenStorageService: TokenStorageService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        // get the user's id from the URL.
        let profileId = Number(this.route.snapshot.paramMap.get('id'));
        // check if it is the current user's profile and store it.
        this.isCurrentUser = profileId === this.tokenStorageService.getUser().id;

        // get the user's subscribers.
        this.profileService.getSubscribers(profileId).subscribe(
            (data: UserSubscription[]) => {
                this.userSubscriptions = data;
            }
        )
    }

    public async changeSubscriptionStatus(subscriberId: number) {
        // request for the subscription status change.
        let data = await this.profileService.changeSubscriptionStatus(subscriberId).toPromise();
        // find the changing subscription id.
        let subscriptionIndex = this.userSubscriptions.findIndex((item: UserSubscription) => item.subscriber.id === subscriberId);
        // update the subscription with the retrieved data.
        this.userSubscriptions[subscriptionIndex] = data;
    }
}
