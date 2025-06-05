package com.example.department_manager.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.example.department_manager.constant.FeeTypeEnum;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "fees")
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Fee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String name;
    private String description;
    @Enumerated(EnumType.STRING)
    FeeTypeEnum feeTypeEnum;
    BigDecimal unitPrice;

    @JsonIgnore  //hide this field
    @OneToMany(mappedBy = "fee", cascade = CascadeType.ALL) //cascade: used for auto updating at fees and invoices table
    List<FeeInvoice> feeInvoices;

    LocalDate createdAt;
    LocalDate updatedAt;

    @PrePersist
    public void beforeCreate() {
        this.createdAt = LocalDate.now();
    }
    @PreUpdate
    public void beforeUpdate() {
        this.updatedAt = LocalDate.now();
    }
}
