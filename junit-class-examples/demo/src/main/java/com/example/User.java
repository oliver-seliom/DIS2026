package com.example;

public class User {
  private String name;
  private Integer age;

  public User(String name, Integer age) {
    this.name = name;
    this.age = age;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Integer getAge() {
    return age;
  }

  public void setAge(Integer age) {
    this.age = age;
  }

  public Double calculateSalary() {
    if (age < 18) {
      return 150.0;
    } else if (age < 65) {
      return 1000.0;
    } else {
      return 1500.0;
    }
  }

}
