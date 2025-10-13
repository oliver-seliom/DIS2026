package com.example.demo;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class UserController {

  @GetMapping("/users")
  public ArrayList<User> getUsers() {

    User user1 = new User("John", 20);
    User user2 = new User("Jane", 21);

    ArrayList<User> users = new ArrayList<>();
    users.add(user1);
    users.add(user2);

    return users;
  }

  @PostMapping("/users")
  public User createUser(@RequestBody User user) {
    // TODO: save user to database
    return user;
  }

  @PutMapping("/users/{id}")
  public User updateUser(@PathVariable int id, @RequestBody User user) {
    // TODO: search for the user and update user in database
    return user;
  }

  @DeleteMapping("/users/{id}")
  public void deleteUser(@PathVariable int id) {
    return;
  }

}
