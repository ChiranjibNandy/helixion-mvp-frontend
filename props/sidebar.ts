import { NavItem, User } from "@/types";
import { EmpNavSection } from "../types/employee";

/**
 * Props for the main Sidebar component
 */
export interface SidebarProps {
  user: User;  // User details to display in the sidebar (name, avatar, etc.)
  navSections: EmpNavSection[];  // Navigation sections containing categories and their menu items
  activeKey: string;  // Currently selected menu item key
  onNavChange: (key: string) => void;  // Callback triggered when a menu item is selected
  onSignOut: () => void;  // Optional logout handler
}

/**
 * Props for the Sidebar profile section
 */
export interface SidebarProfileProps {
  user: User;  // User details displayed in the profile area
}

/**
 * Props for the Sidebar menu component
 */
export interface SidebarMenuProps {
  sections: EmpNavSection[];  // List of navigation sections with categories and items
  activeKey: string;  // Currently active/selected menu item key
  onNavChange: (key: string) => void;  // Function to handle menu item selection
}

/**
 * Props for an individual navigation item
 */
export interface SidebarNavItemProps {
  item: NavItem;  // Navigation item data (label, key, route, etc.)
  isActive: boolean;  // Indicates whether this item is currently selected
  onClick?: (key: string) => void;  // Optional click handler for item selection
}

/**
 * Props for the Sidebar footer section
 */
export interface SidebarFooterProps {
  onSignOut: () => void;  // Optional logout action handler
}