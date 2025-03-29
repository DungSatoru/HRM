package tlu.finalproject.hrmanagement.dto;

import lombok.NoArgsConstructor;

import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleDTO {
    Long roleId;
    String roleName;
}