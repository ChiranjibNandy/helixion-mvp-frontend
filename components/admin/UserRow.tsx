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

export function UserRow({
  user,
  selected,
  onToggleSelect,
  onApprove,
  onDeny,
}: UserRowProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    ];
    const index = Math.abs(hashCode(name)) % colors.length;
    return colors[index];
  };

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
