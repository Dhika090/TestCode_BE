package com.example.TestCode_BE.Repository;

import com.example.TestCode_BE.Model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
