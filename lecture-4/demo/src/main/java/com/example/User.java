package com.example;

public class User {
  private String name;
  private Integer age;

  public User(String name, Integer age) {
    this.name = name;
    this.age = age;
  }

  public void printName() {
    System.out.println(name);
  }
}
