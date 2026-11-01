package com.careerbridge.common;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "site_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteSetting {

    @Id
    @Column(nullable = false)
    @Builder.Default
    private Integer id = 1;

    @Column(name = "portal_name", nullable = false, length = 150)
    private String portalName;

    @Column(length = 255)
    private String tagline;

    @Column(name = "whatsapp_number", nullable = false, length = 25)
    private String whatsappNumber;

    @Column(name = "contact_email", length = 150)
    private String contactEmail;

    @Column(name = "contact_phone", length = 25)
    private String contactPhone;

    @Column(name = "office_address", columnDefinition = "TEXT")
    private String officeAddress;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
