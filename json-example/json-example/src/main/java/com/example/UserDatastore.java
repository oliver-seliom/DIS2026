package com.example;

import java.io.IOException;
import java.util.List;

public class UserDatastore {

  private String rootPath = System.getProperty("user.dir");
  private String filePath = rootPath + "/json-example/src/main/resources/users.json";

  public List<User> getUsers() throws IOException {
    JsonManager jsonManager = new JsonManager();
    List<User> users = jsonManager.getUsersFromJson(this.filePath);
    return users;
  }

}
