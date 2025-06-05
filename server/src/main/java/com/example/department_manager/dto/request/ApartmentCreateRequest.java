package com.example.department_manager.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ApartmentCreateRequest {
    @NotNull
    Long addressNumber;
    double area;
    String status;
    @NotNull
    Long ownerId;
    Long ownerPhone;
    List<Long> memberIds;
}
