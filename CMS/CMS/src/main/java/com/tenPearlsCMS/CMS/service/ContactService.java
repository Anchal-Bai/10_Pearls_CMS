package com.tenPearlsCMS.CMS.service;

import com.tenPearlsCMS.CMS.Entity.Contact;
import com.tenPearlsCMS.CMS.Entity.User;
import com.tenPearlsCMS.CMS.dto.ContactDTO;
import com.tenPearlsCMS.CMS.repository.ContactRepository;
import com.tenPearlsCMS.CMS.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
public class ContactService {
    @Autowired
    private ContactRepository contactRepository;
    @Autowired
    private UserRepository  userRepository; // ✅ This must be present



    public List<Contact> getContactsForUser(Long userId) {
        return contactRepository.findByUserId(userId);
    }

    public Contact addContact(Long userId, Contact contact, User user) {
        contact.setUser(user);
        return contactRepository.save(contact);
    }
    public Contact createContact(ContactDTO contactDTO, Principal principal) {
        // Convert DTO to Entity (Contact)
        Contact contact = new Contact();
        contact.setFirstName(contactDTO.getFirstName());
        contact.setLastName(contactDTO.getLastName());
        contact.setPersonalEmail(contactDTO.getPersonalEmail());
        contact.setWorkEmail(contactDTO.getWorkEmail());
        contact.setHomePhone(contactDTO.getHomePhone());
        contact.setTitle(contactDTO.getTitle());
        contact.setWorkPhone(contactDTO.getWorkPhone());

        // Retrieve the authenticated user based on the principal
        String username = principal.getName();  // Get the username/email
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Associate the contact with the authenticated user
        contact.setUser(user);

        // Save and return the created contact
        return contactRepository.save(contact);
    }


    public void deleteContact(Long contactId, Long userId) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
        if (!contact.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        contactRepository.delete(contact);
    }


    public Contact updateContact(Long userId, Long contactId, Contact updatedContact) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        if (!contact.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        contact.setFirstName(updatedContact.getFirstName());
        contact.setLastName(updatedContact.getLastName());
        contact.setTitle(updatedContact.getTitle());
        contact.setWorkEmail(updatedContact.getWorkEmail());
        contact.setPersonalEmail(updatedContact.getPersonalEmail());
        contact.setWorkPhone(updatedContact.getWorkPhone());
        contact.setHomePhone(updatedContact.getHomePhone());

        return contactRepository.save(contact);
    }
    public Contact patchContact(Long userId, Long contactId, Contact updatedFields) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        if (!contact.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        // Only update the fields that are provided
        if (updatedFields.getFirstName() != null) {
            contact.setFirstName(updatedFields.getFirstName());
        }
        if (updatedFields.getLastName() != null) {
            contact.setLastName(updatedFields.getLastName());
        }
        if (updatedFields.getTitle() != null) {
            contact.setTitle(updatedFields.getTitle());
        }
        if (updatedFields.getWorkEmail() != null) {
            contact.setWorkEmail(updatedFields.getWorkEmail());
        }
        if (updatedFields.getPersonalEmail() != null) {
            contact.setPersonalEmail(updatedFields.getPersonalEmail());
        }
        if (updatedFields.getWorkPhone() != null) {
            contact.setWorkPhone(updatedFields.getWorkPhone());
        }
        if (updatedFields.getHomePhone() != null) {
            contact.setHomePhone(updatedFields.getHomePhone());
        }

        return contactRepository.save(contact);
    }
    public Contact saveContact(Contact contact, Principal principal) {
        String username = principal.getName();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        contact.setUser(user); // associate contact with user
        return contactRepository.save(contact);
    }

}

