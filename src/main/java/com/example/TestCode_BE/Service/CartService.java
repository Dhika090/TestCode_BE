package com.example.TestCode_BE.Service;

import com.example.TestCode_BE.Model.Cart;
import com.example.TestCode_BE.Model.OrderItem;
import com.example.TestCode_BE.Model.Product;
import com.example.TestCode_BE.Repository.CartRepository;
import com.example.TestCode_BE.Repository.OrderItemRepository;
import com.example.TestCode_BE.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;


@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    public Cart addProductToCart(Long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        Cart cart = cartRepository.findById(1L).orElseGet(() -> {
            Cart newCart = new Cart();
            return cartRepository.save(newCart);
        });

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product with ID " + productId + " not found"));

        OrderItem orderItem = new OrderItem();
        orderItem.setProduct(product);
        orderItem.setCart(cart);
        orderItem.setQuantity(quantity);
        orderItemRepository.save(orderItem);

        cart.getItems().add(orderItem);

        return cartRepository.save(cart);
    }

    public Cart getCart() {
        return cartRepository.findById(1L).orElseThrow(() -> new RuntimeException("Cart Not Found"));
    }

    public Cart checkout() {
        Cart cart = cartRepository.findById(1L).orElseThrow(() -> new RuntimeException("Cart Not Found"));
        cart.setCheckedOut(true);
        return cartRepository.save(cart);
    }

}
