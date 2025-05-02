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

import com.tenPearlsCMS.CMS.repository.UserRepository; // Make sure this import is included

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtility jwtUtility;
    private final UserService userService;
    private final UserRepository userRepository;  // Inject UserRepository here

    public AuthController(AuthenticationManager authenticationManager, UserDetailsService userDetailsService,
                          JwtUtility jwtUtility, UserService userService, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtility = jwtUtility;
        this.userService = userService;
        this.userRepository = userRepository;  // Initialize UserRepository
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();
        String name = request.getName();

        try {
            // Check if user already exists
            if (userService.emailExists(email)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "User already exists"));
            }

            // Register user and save encrypted password
            User user = new User(name, email, password);  // Ensure that name, email, and password are included
            user = userService.registerUser(user);

            // Authenticate the user
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            // Load user details and generate JWT token
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            String token = jwtUtility.generateToken(userDetails);

            // Return success response with token
            return ResponseEntity.ok(Map.of(
                    "message", "User registered successfully!",
                    "userId", user.getId(),
                    "token", token
            ));
        } catch (UserAlreadyExistsException e) {
            // Specific exception for user already existing
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            // Handle other unexpected errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("error", "An unexpected error occurred: " + e.getMessage()));
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            // Authenticate the user
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(credentials.get("email"), credentials.get("password"))
            );

            // Load user details by email (Optional<User> returned)
            Optional<User> optionalUser = userRepository.findByEmail(credentials.get("email"));

            // Debugging log to check if the user is found
            if (!optionalUser.isPresent()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
            }

            // Get the user from the Optional
            User user = optionalUser.get();  // Safely get the User from the Optional

            // Debugging log to check the username
            System.out.println("Logged in user: " + user.getName());  // Print the username to the console

            // Load UserDetails for JWT generation
            UserDetails userDetails = userDetailsService.loadUserByUsername(credentials.get("email"));

            // Generate JWT token
            String token = jwtUtility.generateToken(userDetails);

            // Debugging log to check the token
            System.out.println("Generated token: " + token);  // Print the generated token

            // Return the JWT token and username in the response
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", user.getName()  // Return the username
            ));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("error", "An unexpected error occurred: " + e.getMessage()));
        }
    }



}