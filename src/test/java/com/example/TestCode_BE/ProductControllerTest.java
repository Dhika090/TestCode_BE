package com.example.TestCode_BE;

import com.example.TestCode_BE.Controller.ProductController;
import com.example.TestCode_BE.Model.Product;
import com.example.TestCode_BE.Service.ProductService;
import org.apache.coyote.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class ProductControllerTest {

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController productController;

    private Product product;

    @BeforeEach
    void Setup(){
        MockitoAnnotations.openMocks(this);
        product = new Product("Test Product","Test Description", 100.0);
        product.setId(1L);
    }

    @Test
    void testCreateProduct(){
        when(productService.createProduct(any(Product.class))).thenReturn(product);
        ResponseEntity<Product> response = productController.createProduct(product);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(product.getName(),response.getBody().getName());
    }

    @Test
    void testProductById(){
        when(productService.getProductById(1L)).thenReturn(Optional.of(product));
        ResponseEntity<Product> response = productController.getProductById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(product.getId(), response.getBody().getId());
    }
    @Test
    void testGetProductById_NotFound() {
        when(productService.getProductById(1L)).thenReturn(Optional.empty());

        ResponseEntity<Product> response = productController.getProductById(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testUpdateProduct() {
        when(productService.updateProduct(eq(1L), any(Product.class))).thenReturn(product);

        ResponseEntity<Product> response = productController.updateProduct(1L, product);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(product.getName(), response.getBody().getName());
    }
    @Test
    void testDeleteProduct() {
        doNothing().when(productService).deleteProduct(1L);
        ResponseEntity<String> response = productController.deleteProduct(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Produk dengan ID 1 telah berhasil dihapus.", response.getBody());
    }
}
