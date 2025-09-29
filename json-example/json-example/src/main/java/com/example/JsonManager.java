package com.example;

import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class JsonManager {
  public void saveUsersToJson(List<User> users, String filePath) throws IOException {
    Gson gson = new Gson();
    String json = gson.toJson(users);
    FileWriter fileWriter = new FileWriter(filePath);
    fileWriter.write(json);
    fileWriter.close();
  }

  public User getUserFromJson(String filePath) throws IOException {
    String json = Files.readString(Path.of(filePath));
    Gson gson = new Gson();
    User user = gson.fromJson(json, User.class);
    return user;
  }

  public List<User> getUsersFromJson(String filePath) throws IOException {
    String json = Files.readString(Path.of(filePath));
    Gson gson = new Gson();

    Type listType = new TypeToken<List<User>>() {
    }.getType();

    List<User> users = gson.fromJson(json, listType);
    return users;
  }
}