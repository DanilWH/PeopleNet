# PeopleNet
A simple social media application built for the purpose of introducing to RESTful API applications.

#### 1'st commit
 - GET - used for requesting data
 - POST - used for sending data to the server.
 - PUT - used for update data on the server.
 - DELETE - used for removing data from the server.

#### 2'nd commit
 - Introduction to Vue.
 - `vue-resource` - this library allows to make HTTP requests hiding the details of its implementation.

#### 3'nd commit
 - Deleting and changing the data with Vue.js

#### 4'th commit
 - Switching to Angular (part 1). Rendering the page.

#### 5'th commit
 - Switching to Angular (part 2). The ability to delete and change the data.

#### 6'th commit
 - `implementation 'javax.xml.bind:jaxb-api'` is used for Spring conversion different types of data at the controller layer.
 - Use the `@Column(updatable = false)` annotation above a field of a domain to prevent the field from accident updating.
 - The serialization of java objects to JSON and vice versa is done by the "Jackson" library by default.
 - We can use one of the Jackson's annotations to format a LocalDateTime Java object to a prettier looking string by using
   the `@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")` annotation above a field of our domain.
 - You can use the `@JsonView()` annotation to determine what fields to show when making API requests.
   To make that happen you have to create a class with nested interfaces that extend any previous interfaces, e.g.:
   ```java
   public final class Views {
       public interface Id {}

       public interface IdText extends Id {}

       public interface IdCreationTime extends Id{}

       public interface FullMessage extends IdText {}
   }
   ```
   The fact that interfaces extend the previous ones determines what fields will be show according to inheritance.  
   
   Then, actually use the `@JsonView()` annotation above a field of your domain. The parameters have to be those
   interfaces. It determines the level of what fields will be shown within. e.g.:
   ```java
    @JsonView(Views.Id.class)
    private Long id; // will display for the interfaces whose inheritance reaches the Id interface.
    @JsonView(Views.IdText.class)
    private String text; // will display for the interfaces whose inheritance reaches the IdText interface.
    @JsonView({Views.IdCreationTime.class, Views.FullMessage.class})
    private LocalDateTime creationDate; // will display for the interfaces whose inheritance reaches the
                                        // IdCreationTime and FullMessage interface.
   ```
   So
    - `Id` reaches itself.
    - `IdText` reaches `Id` and itself.
    - `FullMessage` reaches `IdText` that, in turn, reaches `Id`. `FullMessage` also reaches itself.
    - `IdCreationTime` reaches `Id` and itself.
   
   The next step will be annotating a controller methods with `@JsonView` annotations. They will determine what fields
   to show. e.g.:
   ```java
   /**
   * Shows only the "id" field in the response body.
   */
   @GetMapping
   @JsonView(Views.IdText.class)
   public List<Message> list() {
       return this.messageRepo.findAll();
   }
   
   /**
   * Shows the "id" and "text" fields in the response body.
   */
   @GetMapping
   @JsonView(Views.IdText.class)
   public List<Message> list() {
       return this.messageRepo.findAll();
   }
   
   /**
   * Shows the "id", "text" and "creationDate" fields in the response body.
   */
   @GetMapping
   @JsonView(Views.FullMessage.class)
   public List<Message> list() {
       return this.messageRepo.findAll();
   }
   
   /**
   * Shows the "id" and "creationDate" fields in the response body.
   */
   @GetMapping
   @JsonView(Views.IdCreationTime.class)
   public List<Message> list() {
       return this.messageRepo.findAll();
   }
   ```
