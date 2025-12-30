package com.bookstore.order.client;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class BookDTO {
    private Long id;
    private String title;
    private String author;
    private BigDecimal price;
    private Integer stock;
}
