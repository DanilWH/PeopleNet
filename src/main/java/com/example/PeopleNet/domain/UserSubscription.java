package com.example.PeopleNet.domain;

import com.fasterxml.jackson.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.codehaus.jackson.annotate.JsonIgnore;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;

@Entity
@Data
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
@ToString(of = "id")
public class UserSubscription {
    @EmbeddedId
    @JsonIgnore
    private UserSubscriptionId id;

    @MapsId("subscriberId")
    @ManyToOne
    @JsonView(Views.IdText.class)
    @JsonIdentityReference(alwaysAsId = true)
    @JsonIdentityInfo(
            property = "id",
            generator = ObjectIdGenerators.PropertyGenerator.class
    )
    @JsonProperty(value = "subscriberId")
    private User subscriber;

    @MapsId("channelId")
    @ManyToOne
    @JsonView(Views.IdText.class)
    @JsonIdentityReference(alwaysAsId = true)
    @JsonIdentityInfo(
            property = "id",
            generator = ObjectIdGenerators.PropertyGenerator.class
    )
    @JsonProperty(value = "channelId")
    private User channel;

    @JsonView(Views.IdText.class)
    private boolean active;

    public UserSubscription(User subscriber, User channel) {
        this.id = new UserSubscriptionId(subscriber.getId(), channel.getId());
        this.subscriber = subscriber;
        this.channel = channel;
    }
}
