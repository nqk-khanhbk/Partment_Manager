package com.example.department_manager.mapper;

import com.example.department_manager.dto.response.UserResponse;
import org.mapstruct.Mapper;
import com.example.department_manager.entity.User;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "email", target = "email")
    UserResponse toUserResponse(User user);

    List<UserResponse> toUserResponseList(List<User> users);
}
