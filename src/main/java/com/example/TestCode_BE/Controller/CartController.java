package com.example.TestCode_BE.Controller;


import com.example.TestCode_BE.Model.Cart;
import com.example.TestCode_BE.Service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<Cart> addProductToChar(@RequestParam Long productId, @RequestParam int quantity){
        Cart cart = cartService.addProductToChart(productId,quantity);
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<Cart> getCart(){
        Cart cart = cartService.getCart();
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @PostMapping("/checkout")
    public ResponseEntity<Cart>checkout(){
        Cart cart = cartService.cartCheckout();
        return new ResponseEntity<>(cart,HttpStatus.OK);
    }


}
