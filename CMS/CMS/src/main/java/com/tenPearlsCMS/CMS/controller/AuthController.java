package com.tenPearlsCMS.CMS.controller;

import com.tenPearlsCMS.CMS.Entity.User;
import com.tenPearlsCMS.CMS.Utility.JwtUtility;
import com.tenPearlsCMS.CMS.dto.RegisterRequest;
import com.tenPearlsCMS.CMS.exception.UserAlreadyExistsException;
import com.tenPearlsCMS.CMS.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

import com.tenPearlsCMS.CMS.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtility jwtUtility;
    private final UserService userService;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager, UserDetailsService userDetailsService,
                          JwtUtility jwtUtility, UserService userService, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtility = jwtUtility;
        this.userService = userService;
        this.userRepository = userRepository;
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();
        String name = request.getName();

        try {

            if (userService.emailExists(email)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "User already exists"));
            }


            User user = new User(name, email, password);
            user = userService.registerUser(user);


            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );


            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            String token = jwtUtility.generateToken(userDetails);


            return ResponseEntity.ok(Map.of(
                    "message", "User registered successfully!",
                    "userId", user.getId(),
                    "token", token
            ));
        } catch (UserAlreadyExistsException e) {

            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("error", "An unexpected error occurred: " + e.getMessage()));
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(credentials.get("email"), credentials.get("password"))
            );


            Optional<User> optionalUser = userRepository.findByEmail(credentials.get("email"));


            if (!optionalUser.isPresent()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
            }


            User user = optionalUser.get();


            System.out.println("Logged in user: " + user.getName());


            UserDetails userDetails = userDetailsService.loadUserByUsername(credentials.get("email"));


            String token = jwtUtility.generateToken(userDetails);


            System.out.println("Generated token: " + token);


            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", user.getName()
            ));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("error", "An unexpected error occurred: " + e.getMessage()));
        }
    }



}