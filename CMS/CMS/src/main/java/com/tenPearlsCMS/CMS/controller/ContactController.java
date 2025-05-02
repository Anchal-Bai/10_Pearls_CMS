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
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

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
    public Contact updateContact(@PathVariable Long id, @RequestBody Contact contact, Authentication authentication) {
        User user = userService.getUserFromAuth(authentication);
        return contactService.updateContact(user.getId(), id, contact);
    }

    @DeleteMapping("/contacts/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable Long id, Authentication authentication) {
        User user = userService.getUserFromAuth(authentication);
        contactService.deleteContact(id, user.getId());
        return ResponseEntity.ok("Deleted");
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
