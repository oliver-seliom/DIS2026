package com.example;

import java.util.HashMap;

public class Main {

    public static void main(String[] args) {
        HashMap<Integer, User> map = new HashMap<>();

        User user1 = new User("John", 20);
        Integer key = 1;

        User user2 = new User("Jane", 21);
        Integer key2 = 2;

        User user3 = new User("Jim", 22);
        Integer key3 = 3;

        map.put(key, user1);
        map.put(key2, user2);
        map.put(key3, user3);

        User fetchedUser = map.get(2);
        fetchedUser.printName();

    }
}