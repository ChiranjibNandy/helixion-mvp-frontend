"use client";

import { User } from "@/types/registration";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import styles from "./UserRow.module.css";

interface UserRowProps {
  user: User;
  selected: boolean;
  onToggleSelect: () => void;
  onApprove: () => void;
  onDeny: () => void;
}

import { getAvatarColor, getInitials } from "@/utils/userUtils";

export function UserRow({
  user,
  selected,
  onToggleSelect,
  onApprove,
  onDeny,
}: UserRowProps) {
  const initials = getInitials(user.name);

  const registeredDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <tr className={styles.row}>
      <td className={styles.checkboxCell}>
        <Checkbox checked={selected} onChange={onToggleSelect} />
      </td>
      <td className={styles.nameCell}>
        <div className={styles.nameContainer}>
          <div
            className={styles.avatar}
            style={{ background: getAvatarColor(user.name) }}
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
          <Button size="sm" onClick={onApprove}>
            Approve
          </Button>
          <Button size="sm" variant="outline" onClick={onDeny}>
            Deny
          </Button>
        </div>
      </td>
    </tr>
  );
}
