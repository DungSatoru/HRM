package tlu.finalproject.hrmanagement.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Table(name = "departments")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long departmentId;

    @Column(name = "department_name", length = 100)
    String departmentName;

    @OneToMany(mappedBy = "department", fetch = FetchType.LAZY)
    private List<User> users;
}
