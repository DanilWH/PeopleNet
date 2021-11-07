# PeopleNet
A simple social media application built for the purpose of introducing to RESTful API applications.

## 1'st commit
 - GET - used for requesting data
 - POST - used for sending data to the server.
 - PUT - used for update data on the server.
 - DELETE - used for removing data from the server.

## 2'nd commit
 - Introduction to Vue.
 - `vue-resource` - this library allows to make HTTP requests hiding the details of its implementation.

## 3'nd commit
 - Deleting and changing the data with Vue.js

## 4'th commit
 - Switching to Angular (part 1). Rendering the page.

## 5'th commit
 - Switching to Angular (part 2). The ability to delete and change the data.

## 6'th commit
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

## 7'th commit

   ###Authentication vs Authorization
   
   ```text
   +------------------------+-----------------------------------------------------+
   | Authentication         | Authorization                                       |
   +------------------------+-----------------------------------------------------+
   | Verifies who you are   | Decides if you have permission to access a resource |
   |                        |                                                     |
   | Methods:               | Methods:                                            |
   |  - Login form          |  - Access Control URLs                              |
   |  - HTTP authentication |  - Access Control List (ACLs)                       |
   |  - Custom auth. method |                                                     |
   +------------------------+-----------------------------------------------------+
   ```

   Whenever the user logs in the first time, we then give them the token, this is __authentication__.  
   Whenever the user sends subsequent request after the logged in with the token, and we verified the token making sure
   the token is valid, we then get all the permissions on that token for that specific user, that is __authorization__.
       
   ### Security with JSON Web Token

   ```text
   +--------+                                       +-------------+
   | Client | ---POST /login, username/password---> | Application |
   +--------+                                       +-------------+
   
   The user sends their credentials to the server for authentication.
   ```

   ```text
   +--------+                                       +-------------+
   | Client | <--------JSON Web Token (JWT)-------- | Application |
   +--------+                                       +-------------+
   
   After the application verified that the credentials are correct, it's going to send a JSON Web Token (JWT) to the
   client. That token is going to have the client information.
   ```
   
   ```text
   +--------------+                                 +-------------+
   | Client (JWT) | ---GET /some-resource, JWT----> | Application |
   +--------------+                                 +-------------+
   
   Then whenever the client needs to send a request to the same application, we don't want them to authenticate again.
   So they're going to send us that token that we gave them as long as it's valid. And then the application is going to
   take the request (it's not going to process the request yet), it's going to check the JSON token, make sure the token
   is valid. And after that, it's also going to check to make sure that the token (the user) has permission to access
   this resource.
   ```
   
   __Refresh token__ is used when the actual access token is expired so that you don't ask the user to send their
   credentials again.  

   ### "Stateless" definition
   By default, Spring Security will create a session when it needs one – this is “ifRequired“.
   For a more stateless application, the “never” option will ensure that Spring Security itself will not create any
   session; however, if the application creates one, then Spring Security will make use of it.
   Finally, the strictest session creation option – “stateless” – is a guarantee that the application will not create
   any session at all.
   These more strict control mechanisms have the direct implication that cookies are not used and so each and every
   request needs to be re-authenticated. This stateless architecture plays well with REST APIs and their Statelessness
   constraint. They also work well with authentication mechanisms such as Basic and Digest Authentication.
   
## 8'th commit
   
   ### WebSockets
   WebSockets provide full-duplex bi-directional communication. That is, enable interaction between the client and the
   server.
   ```text
    Client                                  Server
      |                                        |
      | -------------------------------------> |
      |        Handshake (HTTP Upgrade)        |
      | <------ 101 Switching protocols ------ |
      |                                        |
      |                                        |
      |        Bi-directional messages         |
      | <-- open and persistent connection --> |
      |                                        |
      |                                        |
      |        One side closes chanel          |
      | <-------- connection closed ---------> |
      |                                        |
   ```

## 9'th commit

   ### What are functional interfaces
   
   Here's an example of a functional interface.
   ```java
   @FunctionalInterface
   public interface CustomFunctionalInterface {
      
       //Single abstract method  
       public void firstMethod();
   }
   ```
   The `@FunctionalInterface` is just an informative annotation.
   
   You can use a functional interface when you need to determine a behavior of a function expressed by a lambda.
   
   ### What are lambda expressions (in details).
   A lambda is an anonymous function that can be used to determine a behavior of, for example, an interface.
   To understand the usage of lambda expressions from the ground up, we will first have to define a functional interface.
   ```java
   @FunctionalInterface
   public interface FirstInterface {
       //the abstract method
       public void singleMethod(String param);
   }
   ```
   Now we can create an instance of the interface and determine its behavior with the help of a lambda.
   ```java
   FirstInterface instance = (String param) -> {System.out.println("My lambda says "+ param);};
   ```
   We can now pass this instance as a parameter wherever `FirstInterface` is expected.  
   
   Lambda syntax contains 2 variants of return types.
   
   - __Variant 1__ `(parameters) -> expression` – In this variant the return type of the lambda expression will be same
       as the resultant type of the expression
   - __Variant 2__ `(parameters) -> {statements;}` – In this variant, there will be no return type(or void return type)
       unless the statements inside the curly braces explicitly return something at the end. In that case the return
       type will be same as the type of the variable returned.
   
   Now, let's look at Lambda Expressions in practice:
   ```java
   public class FirstInterfacePrinter {
    
       public void print(FirstInterface firstInterface) {
           firstInterface.singleMethod("apple");
       }
    
       public static void main(String args[]) {
           FirstInterfacePrinter printer=new FirstInterfacePrinter();
           printer.print((String param) -> {
               System.out.println("My lambda says "+ param);
           });
       }
   }
   ```
   
   ### What are function descriptors.
   __Function Descriptor__ is a term used to describe the signature of the abstract method of a __Functional Interface__.
   The signature of the abstract method of a __Functional Interface__ is syntactically the same as the signature of the
   __Lambda Expression__. Hence, a __Function Descriptor__ also describes the signature of a lambda.  
   
   - Example 1:
     ```java
     @FunctionalInterface
     public interface FirstInterface {
       //Single abstract method
       public void singleMethod(String param);
     }
     ```
     For the above interface, named `FirstInterface`, __the signature of the abstract method OR the function descriptor
     is__ `(String) -> void`.
     
   - Example 2:
     ```java
     @FunctionalInterface
     public interface SecondInterface {
       //Single abstract method
       public long computeSum(int num1, int num2);
     }
     ```
     __For SecondInterface the function descriptor is__ `(int,int) -> long`.
   
   ### What are generic classes and methods.
   They allow you to reuse same classes/methods for different primitive data types.
   
   #### Generic class
   
   When creating a generic class, the type parameter for the class is added at the end of the class name within angle
   `<>` brackets.
   ```java
   public class GenericClass<T> {
       private T item;
       public void setItem(T item) {
           this.item = item;
       }
   
       public T getItem() {
           return this.item;
       }
   }
   ```
   Here, `T` is the data type parameter. `T`, `N`, and `E` are some of the letters used for data type parameters
   according to Java conventions.  
   
   In the above example, you can pass it a specific data type when creating a `GenericClass` object.
   ```java
   public static void main(String[] args) {
   
       GenericClass<String> gc1 = new GenericClass<>();
       gc1.setItem("hello");
       String item1 = gc1.getItem(); // "hello"
       gc1.setItem(new Object()); //Error
   
       GenericClass<Integer> gc2 = new GenericClass<>();
       gc2.setItem(new Integer(1));
       Integer item2 = gc2.getItem(); // 1
       gc2.setItem("hello"); //Error
   }
   ```
   You cannot pass a primitive data type to the data type parameter when creating a generic class object.
   Only data types that extend Object type can be passed as type parameters.
   
   For example:
   ```java
   GenericClass<float> gc3 = new GenericClass<>(); //Error
   ```

   #### Generic methods
   
   ```java
   public class GenericMethodClass {
   
       public static <T> void printItems(T[] arr){
           for (int i=0; i< arr.length; i++) {
               System.out.println(arr[i]);
           }
       }
   
       public static void main(String[] args) {
           String[] arr1 = {"Cat", "Dog", "Mouse"};
           Integer[] arr2 = {1, 2, 3};
   
           GenericMethodClass.printItems(arr1); // "Cat", "Dog", "Mouse"
           GenericMethodClass.printItems(arr2); // 1, 2, 3
       }
   }
   ```

   #### The difference between 'T', 'E', 'N'...
   It's more convention than anything else.
  
   * `T` is meant to be a Type  
   * `E` is meant to be an Element (`List<E>`: a list of Elements)  
   * `K` is Key (in a `Map<K,V>`)  
   * `V` is Value (as a return value or mapped value)  
   
   They are fully interchangeable (conflicts in the same declaration notwithstanding).
    
   ### What are Consumers.
   Consumer can be used in all contexts where an object needs to be consumed,i.e. taken as input, and some operation is
   to be performed on the object without returning any result. In fact, a Consumer is nothing but a mere
   __Functional Interface__.
   
## 10'th commit

   ### Redux, state management pattern (or store pattern)
   It allows you to manage application state. Used for convenient storing data in one place that any component can
   access.
   
## 11'th commit

   - Comments with _JPA Entity Graph_.

   ### EntityGraph
   This is another way to describe a quiry in JPA.
   Imagine we have an entity:
   ```java
   @Entity
   public class Characteristic {
   
       @Id
       private Long id;
       private String type;
       
       @ManyToOne(fetch = FetchType.LAZY)
       @JoinColumn
       private Item item;
   
       //Getters and Setters
   }
   ```
   We can see that the `item` property is loaded lazily. __So our goal is to load it eagerly when calling
   `characteristicRepo.findAll()`.__
   
   To make that happen we need to add the `@EntityGraph(attributePaths = {"item"})` annotation above the `findAll()`
   function in JPA repository:
   ```java
   public interface CharacteristicsRepository extends JpaRepository<Characteristic, Long> {
       @EntityGraph(attributePaths = { "item" })
       Characteristic findByType(String type);    
   }
   ```
   This will load the `item` property of the `Characteristic` entity eagerly, __even though our entity declares a
   lazy-loading strategy for this property__.
   
   For more information, go to [Spring _JPA Entity Graph_ Documentation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.entity-graph).
   
   ### What is the N+1 query problem
-----------------------------

The N+1 query problem happens when the data access framework executed N additional SQL statements to fetch the same data that could have been retrieved when executing the primary SQL query.

The larger the value of N, the more queries will be executed, the larger the performance impact. And, unlike the slow query log that can help you find slow running queries, the N+1 issue won’t be spot because each individual additional query runs sufficiently fast to not trigger the slow query log.

The problem is executing a large number of additional queries that, overall, take sufficient time to slow down response time.

Let’s consider we have the following post and post_comments database tables which form a one-to-many table relationship:

[![The `post` and `post_comments` tables][4]][4]

We are going to create the following 4 `post` rows:
    ```sql
    INSERT INTO post (title, id)
    VALUES ('High-Performance Java Persistence - Part 1', 1)
     
    INSERT INTO post (title, id)
    VALUES ('High-Performance Java Persistence - Part 2', 2)
     
    INSERT INTO post (title, id)
    VALUES ('High-Performance Java Persistence - Part 3', 3)
     
    INSERT INTO post (title, id)
    VALUES ('High-Performance Java Persistence - Part 4', 4)
    ```

And, we will also create 4 `post_comment` child records:
    ```sql
    INSERT INTO post_comment (post_id, review, id)
    VALUES (1, 'Excellent book to understand Java Persistence', 1)
     
    INSERT INTO post_comment (post_id, review, id)
    VALUES (2, 'Must-read for Java developers', 2)
     
    INSERT INTO post_comment (post_id, review, id)
    VALUES (3, 'Five Stars', 3)
     
    INSERT INTO post_comment (post_id, review, id)
    VALUES (4, 'A great reference book', 4)
    ```

N+1 query problem with plain SQL
--------------------------------

If you select the `post_comments` using this SQL query:
    ```java
    List<Tuple> comments = entityManager.createNativeQuery("""
        SELECT
            pc.id AS id,
            pc.review AS review,
            pc.post_id AS postId
        FROM post_comment pc
        """, Tuple.class)
    .getResultList();
    ```

And, later, you decide to fetch the associated `post` `title` for each `post_comment`:
    ```java
    for (Tuple comment : comments) {
        String review = (String) comment.get("review");
        Long postId = ((Number) comment.get("postId")).longValue();
     
        String postTitle = (String) entityManager.createNativeQuery("""
            SELECT
                p.title
            FROM post p
            WHERE p.id = :postId
            """)
        .setParameter("postId", postId)
        .getSingleResult();
     
        LOGGER.info(
            "The Post '{}' got this review '{}'",
            postTitle,
            review
        );
    }
    ```

You are going to trigger the N+1 query issue because, instead of one SQL query, you executed 5 (1 + 4):
    ```sql
    SELECT
        pc.id AS id,
        pc.review AS review,
        pc.post_id AS postId
    FROM post_comment pc
     
    SELECT p.title FROM post p WHERE p.id = 1
    -- The Post 'High-Performance Java Persistence - Part 1' got this review
    -- 'Excellent book to understand Java Persistence'
        
    SELECT p.title FROM post p WHERE p.id = 2
    -- The Post 'High-Performance Java Persistence - Part 2' got this review
    -- 'Must-read for Java developers'
         
    SELECT p.title FROM post p WHERE p.id = 3
    -- The Post 'High-Performance Java Persistence - Part 3' got this review
    -- 'Five Stars'
         
    SELECT p.title FROM post p WHERE p.id = 4
    -- The Post 'High-Performance Java Persistence - Part 4' got this review
    -- 'A great reference book'
    ```

Fixing the N+1 query issue is very easy. All you need to do is extract all the data you need in the original SQL query, like this:
    ```java
    List<Tuple> comments = entityManager.createNativeQuery("""
        SELECT
            pc.id AS id,
            pc.review AS review,
            p.title AS postTitle
        FROM post_comment pc
        JOIN post p ON pc.post_id = p.id
        """, Tuple.class)
    .getResultList();
     
    for (Tuple comment : comments) {
        String review = (String) comment.get("review");
        String postTitle = (String) comment.get("postTitle");
     
        LOGGER.info(
            "The Post '{}' got this review '{}'",
            postTitle,
            review
        );
    }
    ```

This time, only one SQL query is executed to fetch all the data we are further interested in using.

N+1 query problem with JPA and Hibernate
----------------------------------------

When using JPA and Hibernate, there are several ways you can trigger the N+1 query issue, so it’s very important to know how you can avoid these situations.

For the next examples, consider we are mapping the `post` and `post_comments` tables to the following entities:

[![`Post` and `PostComment` entities][5]][5]

The JPA mappings look like this:
    ```java
    @Entity(name = "Post")
    @Table(name = "post")
    public class Post {
     
        @Id
        private Long id;
     
        private String title;
     
        //Getters and setters omitted for brevity
    }
    ```
     
    ```java
    @Entity(name = "PostComment")
    @Table(name = "post_comment")
    public class PostComment {
     
        @Id
        private Long id;
     
        @ManyToOne
        private Post post;
     
        private String review;
     
        //Getters and setters omitted for brevity
    }
    ```

## `FetchType.EAGER`

Using `FetchType.EAGER` either implicitly or explicitly for your JPA associations is a bad idea because you are going to fetch way more data that you need. More, the `FetchType.EAGER` strategy is also prone to N+1 query issues.

Unfortunately, the `@ManyToOne` and `@OneToOne` associations use `FetchType.EAGER` by default, so if your mappings look like this:
    ```java
    @ManyToOne
    private Post post;
    ```

You are using the `FetchType.EAGER` strategy, and, every time you forget to use `JOIN FETCH` when loading some `PostComment` entities with a JPQL or Criteria API query:
    ```java
    List<PostComment> comments = entityManager
    .createQuery("""
        select pc
        from PostComment pc
        """, PostComment.class)
    .getResultList();
    ```

You are going to trigger the N+1 query issue:
    ```sql
    SELECT 
        pc.id AS id1_1_, 
        pc.post_id AS post_id3_1_, 
        pc.review AS review2_1_ 
    FROM 
        post_comment pc;
    
    SELECT p.id AS id1_0_0_, p.title AS title2_0_0_ FROM post p WHERE p.id = 1;
    SELECT p.id AS id1_0_0_, p.title AS title2_0_0_ FROM post p WHERE p.id = 2;
    SELECT p.id AS id1_0_0_, p.title AS title2_0_0_ FROM post p WHERE p.id = 3;
    SELECT p.id AS id1_0_0_, p.title AS title2_0_0_ FROM post p WHERE p.id = 4;
    ```

Notice the additional `SELECT` statements that are executed because the `post` association has to be fetched prior to returning the `List` of `PostComment` entities.

Unlike the default fetch plan, which you are using when calling the `find` method of the `EnrityManager`, a JPQL or Criteria API query defines an explicit plan that Hibernate cannot change by injecting a JOIN FETCH automatically. So, you need to do it manually.

If you didn't need the `post` association at all, you are out of luck when using `FetchType.EAGER` because there is no way to avoid fetching it. That's why it's better to use `FetchType.LAZY` by default.

But, if you wanted to use `post` association, then you can use `JOIN FETCH` to avoid the N+1 query problem:
    ```java
    List<PostComment> comments = entityManager.createQuery("""
        select pc
        from PostComment pc
        join fetch pc.post p
        """, PostComment.class)
    .getResultList();
    
    for(PostComment comment : comments) {
        LOGGER.info(
            "The Post '{}' got this review '{}'", 
            comment.getPost().getTitle(), 
            comment.getReview()
        );
    }
    ```

This time, Hibernate will execute a single SQL statement:
    ```sql
    SELECT 
        pc.id as id1_1_0_, 
        pc.post_id as post_id3_1_0_, 
        pc.review as review2_1_0_, 
        p.id as id1_0_1_, 
        p.title as title2_0_1_ 
    FROM 
        post_comment pc 
    INNER JOIN 
        post p ON pc.post_id = p.id
        
    -- The Post 'High-Performance Java Persistence - Part 1' got this review 
    -- 'Excellent book to understand Java Persistence'
    
    -- The Post 'High-Performance Java Persistence - Part 2' got this review 
    -- 'Must-read for Java developers'
    
    -- The Post 'High-Performance Java Persistence - Part 3' got this review 
    -- 'Five Stars'
    
    -- The Post 'High-Performance Java Persistence - Part 4' got this review 
    -- 'A great reference book'
    ```

## `FetchType.LAZY`

Even if you switch to using `FetchType.LAZY` explicitly for all associations, you can still bump into the N+1 issue.

This time, the `post` association is mapped like this:
```java
    @ManyToOne(fetch = FetchType.LAZY)
    private Post post;
```

Now, when you fetch the `PostComment` entities:

```java
    List<PostComment> comments = entityManager
    .createQuery("""
        select pc
        from PostComment pc
        """, PostComment.class)
    .getResultList();
 ```

Hibernate will execute a single SQL statement:
```sql
    SELECT 
        pc.id AS id1_1_, 
        pc.post_id AS post_id3_1_, 
        pc.review AS review2_1_ 
    FROM 
        post_comment pc
 ```

But, if afterward, you are going to reference the lazy-loaded `post` association:
```java
    for(PostComment comment : comments) {
        LOGGER.info(
            "The Post '{}' got this review '{}'", 
            comment.getPost().getTitle(), 
            comment.getReview()
        );
    }
 ```

You will get the N+1 query issue:
```sql
    SELECT p.id AS id1_0_0_, p.title AS title2_0_0_ FROM post p WHERE p.id = 1
    -- The Post 'High-Performance Java Persistence - Part 1' got this review 
    -- 'Excellent book to understand Java Persistence'
    
    SELECT p.id AS id1_0_0_, p.title AS title2_0_0_ FROM post p WHERE p.id = 2
    -- The Post 'High-Performance Java Persistence - Part 2' got this review 
    -- 'Must-read for Java developers'
    
    SELECT p.id AS id1_0_0_, p.title AS title2_0_0_ FROM post p WHERE p.id = 3
    -- The Post 'High-Performance Java Persistence - Part 3' got this review 
    -- 'Five Stars'
    
    SELECT p.id AS id1_0_0_, p.title AS title2_0_0_ FROM post p WHERE p.id = 4
    -- The Post 'High-Performance Java Persistence - Part 4' got this review 
    -- 'A great reference book'
 ```

Because the `post` association is fetched lazily, a secondary SQL statement will be executed when accessing the lazy association in order to build the log message.

Again, the fix consists in adding a `JOIN FETCH` clause to the JPQL query:
```java
    List<PostComment> comments = entityManager.createQuery("""
        select pc
        from PostComment pc
        join fetch pc.post p
        """, PostComment.class)
    .getResultList();
    
    for(PostComment comment : comments) {
        LOGGER.info(
            "The Post '{}' got this review '{}'", 
            comment.getPost().getTitle(), 
            comment.getReview()
        );
    }
 ```

And, just like in the `FetchType.EAGER` example, this JPQL query will generate a single SQL statement.

> Even if you are using `FetchType.LAZY` and don't reference the child association of a bidirectional `@OneToOne` JPA relationship, you can still trigger the N+1 query issue.

## How to automatically detect the N+1 query issue

If you want to automatically detect N+1 query issue in your data access layer, you can use the [`db-util`][7] open-source project.

First, you need to add the following Maven dependency:
```xml
    <dependency>
        <groupId>com.vladmihalcea</groupId>
        <artifactId>db-util</artifactId>
        <version>${db-util.version}</version>
    </dependency>
 ```

Afterward, you just have to use `SQLStatementCountValidator` utility to assert the underlying SQL statements that get generated:
```java
    SQLStatementCountValidator.reset();
    
    List<PostComment> comments = entityManager.createQuery("""
    	select pc
    	from PostComment pc
    	""", PostComment.class)
    .getResultList();
    
    SQLStatementCountValidator.assertSelectCount(1);
 ```

In case you are using `FetchType.EAGER` and run the above test case, you will get the following test case failure:
```sql
    SELECT 
    	pc.id as id1_1_, 
    	pc.post_id as post_id3_1_, 
    	pc.review as review2_1_ 
    FROM 
    	post_comment pc
    
    SELECT p.id as id1_0_0_, p.title as title2_0_0_ FROM post p WHERE p.id = 1
    
    SELECT p.id as id1_0_0_, p.title as title2_0_0_ FROM post p WHERE p.id = 2
    
    
    -- SQLStatementCountMismatchException: Expected 1 statement(s) but recorded 3 instead!
 ```

## 12'th commit

   The solution for self-reference cycles. Jackson.
   Put the following annotation above the back-referenced class:
   ```java
    @JsonIdentityInfo(
            property = "id",
            generator = ObjectIdGenerators.PropertyGenerator.class
    )
   ```
   In the "property" argument we define what we want to show in JSON when the self-reference case occurs.
   
## 13'th commit

   Infinite scrolling of lists.
   
## 14'th commit

   __User's subscriptions.__

   __Q:__ *What does `@JoinTable` do?*  
   __A:__ `@JoinTable` creates a third table to maintain the relationship between the other two tables.

   __Q:__ *How to make the `@AuthenticationPrincipal` work with __JWT__*  
   __A:__ In order to make that happen you need to put the whole `UserDetails` object into
   `UsernamePasswordAuthenticationToken` in the class that extends `OncePerRequestFilter`.
   ```java
   public class CustomAuthorizationFilter extends OncePerRequestFilter {
    ...
                String accessToken = JwtUtils.extractJwsFromHeader(request);
                String subject = JwtUtils.verifyTokenAndReturnClaims(accessToken).getSubject();

                User userDetails = (User) userService.loadUserByUsername(subject);
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
    ...
   }
   ```

## 15'th commit

   __Subscriptions with confirmations.__
   
   Creating a composite key in the database:  
   __Q:__ *What is a Composite Key*  
   __A:__ Sometimes you can guarantee uniqueness of a record through a combination of column values.
          This is what a composite key is. It’s a key formed by joining multiple column values that guarantee uniqueness.
   
   *Example of a composite key:*
   ```roomsql
   CREATE TABLE course_grades (
       quarter_id INTEGER,
       course_id TEXT,
       student_id INTEGER,
       grade INTEGER,
       PRIMARY KEY(quarter_id, course_id, student_id)
   );
   ```

   We represent a composite primary key in Spring Data by using the `@Embeddable` annotation on a class.
   This key is then embedded in the table's corresponding entity class as the composite primary key by using the
   `@EmbeddedId` annotation on a field of the `@Embeddable` type. (More on: <https://www.baeldung.com/spring-jpa-embedded-method-parameters>)

   It's done with the following annotations:
   - `@Embeddable` - using this annotation on a class tells JPA that the class is the composite key.
   - `@EmebeddedId` - using this annotation on a field of the class tells JPA that this field is the composite key for
     the class (`@Entity`).
   - `@MapsId` - searches the entity in the database by the composite key and populates the annotated field with the found value.
     (Designates a ManyToOne or OneToOne relationship attribute that provides the mapping for an EmbeddedId primary key,
      an attribute within an EmbeddedId primary key, or a simple primary key of the parent entity. The value element 
      specifies the attribute within a composite key to which the relationship attribute corresponds.)

## 16'th commit

   __Subscriptions with confirmations (part 2, front-end job).__
   
   Unfortunately, there's no such thing as
   [@JsonIgnoreProperties should support nested properties #2940](https://github.com/FasterXML/jackson-databind/issues/2940)  
   As stated in the answer to that issue:
   > No plans to ever implement this (due to delegating design, will not be possible with current Jackson architecture), closing.
