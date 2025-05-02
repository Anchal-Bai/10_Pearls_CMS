
package com.tenPearlsCMS.CMS.repository;

import com.tenPearlsCMS.CMS.Entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    // Fetch contacts for a specific user
    List<Contact> findByUserId(Long userId);

    // Optional: add search filters by first/last name for a specific user
    List<Contact> findByUserIdAndFirstNameContainingIgnoreCase(Long userId, String firstName);
    List<Contact> findByUserIdAndLastNameContainingIgnoreCase(Long userId, String lastName);
}
