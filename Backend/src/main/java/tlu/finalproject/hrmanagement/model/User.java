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

    @Column(name = "identity", nullable = false, length = 12)
    String identity;

    @Column(name = "email", unique = true, length = 100)
    String email;

    @Column(name = "phone", unique = true, length = 15)
    String phone;

    @Column(name = "full_name", length = 100)
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
    @Column(columnDefinition = "ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE'")
    private Status status;

    @Temporal(TemporalType.DATE)
    @Column(name = "hire_date")
    private Date hireDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false, name = "created_at")
    private Date createdAt = new Date();

}
