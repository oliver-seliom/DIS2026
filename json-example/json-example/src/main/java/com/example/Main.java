package com.example;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) throws IOException {

        User user1 = new User();
        user1.setName("John");
        user1.setAge(20);

        User user2 = new User();
        user2.setName("Jane");
        user2.setAge(21);

        List<User> users = new ArrayList<>();
        // users.add(user1);
        // users.add(user2);

        String rootPath = System.getProperty("user.dir");
        String filePath = rootPath + "/json-example/src/main/resources/users.json";

        JsonManager jsonManager = new JsonManager();
        users = jsonManager.getUsersFromJson(filePath);

        for (User user : users) {
            System.out.println(user.getName());
            System.out.println(user.getAge());
        }

        // User user = jsonManager.getUserFromJson(filePath);
        // System.out.println(user.getName());
        // System.out.println(user.getAge());

        // try {
        // JsonManager jsonManager = new JsonManager();
        // jsonManager.saveUsersToJson(users, filePath);
        // System.out.println("Users saved to " + filePath);
        // } catch (IOException e) {
        // System.err.println("Error writing to file: " + e.getMessage());
        // }
    }
}