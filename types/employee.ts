import { NavItem } from "@/types";

/**
 * Represents a navigation section in the employee sidebar
 */
export interface EmpNavSection {
  category: string;// Title of the section (e.g., "Dashboard", "Management")
  items: NavItem[];// List of navigation items under this category
}