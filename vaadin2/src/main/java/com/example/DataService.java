package com.example;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;

public class DataService {
  public List<Country> getCountries() throws URISyntaxException, IOException, InterruptedException {
    List<Country> countries = new ArrayList<>();

    HttpClient client = HttpClient.newHttpClient();
    HttpRequest request = HttpRequest.newBuilder()
        .uri(new URI("http://localhost:8081/countries"))
        .GET()
        .build();

    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    String responseBody = response.body();

    Gson gson = new Gson();
    Type countryListType = new TypeToken<ArrayList<Country>>() {
    }.getType();

    countries = gson.fromJson(responseBody, countryListType);

    // System.out.println(responseBody);

    return countries;
  }

  public Country createCountry(String name, String code) throws IOException, InterruptedException {
    Country country = new Country(name, code);

    Gson gson = new Gson();
    String body = gson.toJson(country);

    HttpClient client = HttpClient.newHttpClient();
    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("http://localhost:8081/countries"))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(body))
        .build();

    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    System.out.println(response.body());

    return country;
  }
}
