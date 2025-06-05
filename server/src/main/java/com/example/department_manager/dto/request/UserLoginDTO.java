package com.example.department_manager.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level= AccessLevel.PRIVATE)
@Builder
public class UserLoginDTO {
    @NotBlank(message = "username can't be blank")
    String email;

    @NotBlank(message = "password can't be blank")
    String password;
}
