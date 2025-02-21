package tlu.finalproject.hrmanagement.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User{
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

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    Role role;

    @ManyToOne
    @JoinColumn(name = "department_id")
    Department department;

    @ManyToOne
    @JoinColumn(name = "position_id")
    Position position;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE'")
    private Status status;

    @Temporal(TemporalType.DATE)
    private Date hireDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date createdAt = new Date();

}
