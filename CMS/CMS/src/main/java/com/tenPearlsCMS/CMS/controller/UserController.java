package com.tenPearlsCMS.CMS.controller;


import com.tenPearlsCMS.CMS.Entity.User;
import com.tenPearlsCMS.CMS.dto.UserResponseDTO;
import com.tenPearlsCMS.CMS.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // API to fetch the current user's username (email)
    @GetMapping("/me")
    public String getCurrentUsername(Authentication authentication) {
        return authentication.getName(); // returns the email or username from JWT token
    }

    // OR: If you want full user info (excluding password)
//    @GetMapping("/me/details")
//    public User getCurrentUserDetails(Authentication authentication) {
//        return userService.getUserFromAuth(authentication);
//    }
    @GetMapping("/me/details")
    public UserResponseDTO getCurrentUserDetails(Authentication authentication) {
        User user = userService.getUserFromAuth(authentication);
        return new UserResponseDTO(user);
    }
    @PutMapping("/me")
    public UserResponseDTO updateCurrentUser(@RequestBody User updatedUser, Authentication authentication) {
        User user = userService.getUserFromAuth(authentication);
        User updated = userService.updateUser(user.getId(), updatedUser);
        return new UserResponseDTO(updated);
    }
    @DeleteMapping("/me")
    public String deleteCurrentUser(Authentication authentication) {
        User user = userService.getUserFromAuth(authentication);
        userService.deleteUser(user.getId());
        return "Your account has been deleted.";
    }


}

