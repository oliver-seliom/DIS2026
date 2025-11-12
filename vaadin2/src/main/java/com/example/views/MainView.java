package com.example.views;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import com.example.Country;
import com.example.DataService;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.Route;

@Route(value = "")
public class MainView extends VerticalLayout {
  public MainView() {

    DataService dataService = new DataService();

    TextField textField = new TextField();
    textField.setLabel("Country Name");

    TextField codeField = new TextField();
    codeField.setLabel("Country Code");

    Button button = new Button("Create Country");
    button.addClickListener(event -> {

      try {
        dataService.createCountry(textField.getValue(), codeField.getValue());
      } catch (IOException | InterruptedException e) {
        e.printStackTrace();
      }
    });

    // ComboBox<Country> comboBox = new ComboBox<>("Country");
    // comboBox.setItemLabelGenerator(Country::getName);

    // Country finland = new Country("Finland", "FI");
    // Country sweden = new Country("Sweden", "SE");
    // Country norway = new Country("Norway", "NO");

    // List<Country> countries = new ArrayList<>();
    // countries.add(finland);
    // countries.add(sweden);
    // countries.add(norway);

    // comboBox.setItems(countries);

    // comboBox.setItems(new Country("Finland", "FI"), new Country("Sweden", "SE"),
    // new Country("Norway", "NO"));
    // add(comboBox);

    // Grid<Country> grid = new Grid<>(Country.class, false);
    // grid.addColumn(Country::getName).setHeader("Name");
    // grid.addColumn(Country::getCode).setHeader("Code");

    // grid.setItems(countries);
    // add(grid);

    // textField.setValue("Ruukinkatu 2");

    add(textField);
    add(codeField);
    add(button);
  }
}
