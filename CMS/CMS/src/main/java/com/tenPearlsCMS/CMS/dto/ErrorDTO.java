package com.tenPearlsCMS.CMS.dto;

public class ErrorDTO {

    private String message;

    // Constructor
    public ErrorDTO(String message) {
        this.message = message;
    }

    // Getter and Setter
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}



