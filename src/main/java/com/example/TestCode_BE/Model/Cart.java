package com.example.TestCode_BE.Model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    private boolean checkedOut = false;

    public Cart() {
        this.items = new ArrayList<>();
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public List<OrderItem> getItems() {
        return items;
    }
    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public boolean isCheckedOut() {
        return checkedOut;
    }
    public void setCheckedOut(boolean checkedOut) {
        this.checkedOut = checkedOut;
    }
}
