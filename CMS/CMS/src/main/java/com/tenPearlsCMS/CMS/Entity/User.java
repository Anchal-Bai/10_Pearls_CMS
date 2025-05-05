package com.tenPearlsCMS.CMS.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // ✅ Add this line

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;


    @JsonManagedReference
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Contact> contacts = new ArrayList<>();


    public User(String name, String email, String password) {
        System.out.println("Constructor: name=" + name + ", email=" + email + ", password=" + password);
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public User() {}

}
