package com.example.TestCode_BE.Repository;

import com.example.TestCode_BE.Model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
}
