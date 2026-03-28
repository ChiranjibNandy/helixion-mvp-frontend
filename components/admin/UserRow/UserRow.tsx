"use client";

import { User } from "@/types/registration";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getAvatarColor,
  getInitials,
  formatRegistrationDate,
} from "@/utils/userUtils";
import styles from "./UserRow.module.css";

interface UserRowProps {
  user: User;
  selected: boolean;
  onToggleSelect: (userId: string) => void;
  onApprove: (user: User) => void;
  onDeny: (userId: string) => void;
}

export function UserRow({
  user,
  selected,
  onToggleSelect,
  onApprove,
  onDeny,
}: UserRowProps) {
  const initials = getInitials(user.name);
  const avatarColor = getAvatarColor(user.name);
  const registeredDate = formatRegistrationDate(user.createdAt);

  return (
    <tr className={styles.row}>
      <td className={styles.checkboxCell}>
        <Checkbox
          checked={selected}
          onChange={() => onToggleSelect(user.id)}
          aria-label={`Select ${user.name}`}
        />
      </td>
      <td className={styles.nameCell}>
        <div className={styles.nameContainer}>
          <div
            className={styles.avatar}
            style={{ background: avatarColor }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <span className={styles.name}>{user.name}</span>
        </div>
      </td>
      <td className={styles.emailCell}>{user.email}</td>
      <td className={styles.dateCell}>{registeredDate}</td>
      <td className={styles.actionsCell}>
        <div className={styles.actions}>
          <Button size="sm" onClick={() => onApprove(user)}>
            Approve
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDeny(user.id)}>
            Deny
          </Button>
        </div>
      </td>
    </tr>
  );
}
