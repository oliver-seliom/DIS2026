package com.example;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

import org.junit.jupiter.api.Test;

public class UserTest {
  @Test
  void testGetAge() {
    User user = new User("Oliver", 20);
    assertEquals(user.getAge(), 20);
    assertTrue(user.getAge().equals(20));
    assertFalse(user.getAge() == null);
    assertNotNull(user.getAge());
    assertNull(null);

  }

  @Test
  void testGetName() {
    // fail("Not implemented");
  }

  @Test
  void testCalculateSalary() {
    User user = new User("Oliver", 20);
    assertEquals(user.calculateSalary(), 1000.0);

    User user2 = new User("Oliver", 65);
    assertEquals(user2.calculateSalary(), 1500.0);

    User user3 = new User("Oliver", 17);
    assertEquals(user3.calculateSalary(), 0.0);

  }

  @Test
  void testSetAge() {

  }

  @Test
  void testSetName() {

  }
}
