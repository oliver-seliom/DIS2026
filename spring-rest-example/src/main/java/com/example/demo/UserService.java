package com.example.demo;

public class UserService {

  public User getUserById(int id) {
    return new User("John", 20);
  }

  public User createUser(User user) {
    return user;
  }
}
