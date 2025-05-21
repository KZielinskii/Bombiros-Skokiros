package com.backend.controller;

import com.backend.model.UserApp;
import com.backend.service.UserAppService;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/users")
public class UserAppController {

    private final UserAppService userService;

    public UserAppController(UserAppService userService) {
        this.userService = userService;
    }

    @PostMapping
    public UserApp createUser(@RequestBody UserApp user) {
        return userService.createUser(user);
    }

}
