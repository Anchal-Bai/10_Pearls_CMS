package com.tenPearlsCMS.CMS.controller;

import com.tenPearlsCMS.CMS.Entity.Contact;
import com.tenPearlsCMS.CMS.Entity.User;
import com.tenPearlsCMS.CMS.dto.ContactDTO;
import com.tenPearlsCMS.CMS.dto.ErrorDTO;
import com.tenPearlsCMS.CMS.repository.ContactRepository;
import com.tenPearlsCMS.CMS.repository.UserRepository;
import com.tenPearlsCMS.CMS.service.ContactService;
import com.tenPearlsCMS.CMS.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@RequestMapping("/api")
public class ContactController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContactRepository contactRepository;

    private final ContactService contactService;
    private final UserService userService;

    @Autowired
    public ContactController(ContactService contactService, UserService userService) {
        this.contactService = contactService;
        this.userService = userService;
    }



    @PutMapping("/contacts/{id}")
    public ResponseEntity<?> updateContact(@PathVariable("id") Long contactId,
                                           @RequestBody Contact updatedContact,
                                           Principal principal) {
        try {
            // Get logged-in user
            String username = principal.getName();
            User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            // Call service to update contact
            Contact updated = contactService.updateContact(user.getId(), contactId, updatedContact);
            return ResponseEntity.ok(updated);

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating contact");
        }
    }

    @DeleteMapping("/contacts/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable("id") Long contactId, Principal principal) {
        try {
            String username = principal.getName();
            User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            System.out.println("Attempting to delete contact with ID: " + contactId + " for user: " + username);

            contactService.deleteContact(contactId, user.getId());
            return ResponseEntity.ok("Contact deleted successfully");

        } catch (UsernameNotFoundException e) {
            System.err.println("User not authenticated: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        } catch (RuntimeException e) {
            System.err.println("Runtime error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();  // This prints the full stack trace
            System.err.println("Unexpected error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting contact");
        }
    }



            @PatchMapping("/contacts/{id}")
    public Contact patchContact(@PathVariable Long id, @RequestBody Contact updatedFields, Authentication authentication) {
        User user = userService.getUserFromAuth(authentication);
        return contactService.patchContact(user.getId(), id, updatedFields);
    }

    @PostMapping("/contacts")
    public ResponseEntity<ContactDTO> createContact(@RequestBody Contact contact, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        contact.setUser(user);
        Contact saved = contactRepository.save(contact);

        ContactDTO dto = new ContactDTO(saved); // Return cleaned DTO instead of full entity
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/contacts")
    public ResponseEntity<List<ContactDTO>> getContactsByUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch and map to DTO
        List<ContactDTO> dtoList = contactRepository.findByUserId(user.getId()).stream()
                .map(ContactDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }




}
