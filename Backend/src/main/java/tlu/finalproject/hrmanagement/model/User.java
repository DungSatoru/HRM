package tlu.finalproject.hrmanagement.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long userId;

    @Column(name = "username", nullable = false, unique = true, length = 100)
    String username;

    @Column(name = "password", nullable = false)
    String password;

    @Column(name = "identity", nullable = false, unique = true, length = 12)
    String identity;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    String email;

    @Column(name = "phone", nullable = false, unique = true, length = 15)
    String phone;

    @Column(name = "full_name", nullable = false, length = 100)
    String fullName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false, referencedColumnName = "roleId")
    Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false, referencedColumnName = "departmentId")
    Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id", nullable = false, referencedColumnName = "positionId")
    Position position;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'PROBATION) DEFAULT 'ACTIVE'")
    private EmploymentStatus status;

    @Temporal(TemporalType.DATE)
    @Column(name = "hire_date")
    private Date hireDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false, name = "created_at")
    private Date createdAt = new Date();

    @Column(name = "gender", nullable = true)
    Boolean gender;

    @Column(name = "date_of_birth", nullable = true)
    Date dateOfBirth;

    @Column(name = "address", length = 255)
    String address;

    @Column(name = "profile_image_url", length = 255)
    String profileImageUrl;

    @Column(name = "emergency_contact_name", length = 100)
    String emergencyContactName;

    @Column(name = "emergency_contact_phone", length = 15)
    String emergencyContactPhone;

    @Column(name = "contract_type", length = 50)
    String contractType;

    @Column(name = "education_level", length = 100)
    String educationLevel;
}
