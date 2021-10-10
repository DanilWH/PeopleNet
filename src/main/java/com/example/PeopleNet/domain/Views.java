package com.example.PeopleNet.domain;

public final class Views {
    public interface Id { }

    public interface IdText extends Id { }

    public interface IdCreationTime extends Id { }

    public interface FullMessage extends IdText { }

    public interface FullComment extends IdText { }

    public interface FullProfile extends IdText { }
}
