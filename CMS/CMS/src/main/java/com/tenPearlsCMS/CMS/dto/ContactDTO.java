package com.tenPearlsCMS.CMS.dto;

import com.tenPearlsCMS.CMS.Entity.Contact;

public class ContactDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String personalEmail;
    private String workEmail;
    private String homePhone;
    private String title;
    private String workPhone;


    public ContactDTO(Contact contact) {
        this.id = contact.getId();
        this.firstName = contact.getFirstName();
        this.lastName = contact.getLastName();
        this.personalEmail = contact.getPersonalEmail();
        this.workEmail = contact.getWorkEmail();
        this.homePhone = contact.getHomePhone();
        this.title = contact.getTitle();
        this.workPhone = contact.getWorkPhone();

    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPersonalEmail() {
        return personalEmail;
    }

    public void setPersonalEmail(String personalEmail) {
        this.personalEmail = personalEmail;
    }

    public String getWorkEmail() {
        return workEmail;
    }

    public void setWorkEmail(String workEmail) {
        this.workEmail = workEmail;
    }

    public String getHomePhone() {
        return homePhone;
    }

    public void setHomePhone(String homePhone) {
        this.homePhone = homePhone;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getWorkPhone() {
        return workPhone;
    }

    public void setWorkPhone(String workPhone) {
        this.workPhone = workPhone;
    }
}
