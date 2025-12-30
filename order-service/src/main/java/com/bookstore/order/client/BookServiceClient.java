package com.bookstore.order.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "book-service")
public interface BookServiceClient {

    @GetMapping("/api/books/{id}")
    BookDTO getBookById(@PathVariable Long id);

    @GetMapping("/api/books/{id}/check-stock")
    Boolean checkStock(@PathVariable Long id, @RequestParam Integer quantity);

    @PostMapping("/api/books/{id}/update-stock")
    void updateStock(@PathVariable Long id, @RequestParam Integer quantity);
}
