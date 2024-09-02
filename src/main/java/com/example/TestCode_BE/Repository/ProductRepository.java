package com.example.TestCode_BE.Repository;

import com.example.TestCode_BE.Model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}