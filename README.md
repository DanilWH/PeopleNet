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