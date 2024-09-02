package com.example.TestCode_BE.Controller;

import com.example.TestCode_BE.Model.Product;
import com.example.TestCode_BE.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/")
    public String index(Model model) {
        List<Product> products = productService.getAllProducts(0, 10).getContent();
        model.addAttribute("products", products);
        return "index";
    }

    // Create new Product
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product createdProduct = productService.createProduct(product);
        String message = "Produk Berhasil DiTambahkan.";
        System.out.println(message);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Product> products = productService.getAllProducts(page, size);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Get Product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        String message = "Produk dengan ID " + id + " telah berhasil di Ubah.";
        System.out.println(message);
        return product.map(ResponseEntity::ok)
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Update Product by ID
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product productDetails) {
        Product updatedProduct = productService.updateProduct(id, productDetails);
        return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
    }

        @DeleteMapping("/{id}")
        public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
            productService.deleteProduct(id);
            String message = "Produk dengan ID " + id + " telah berhasil dihapus.";
            System.out.println(message);
            return new ResponseEntity<>(message, HttpStatus.OK);
        }
    }
