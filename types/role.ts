// Matches the backend's ORG_ROLE enum exactly (helixion-mvp-backend
// src/constants/enum.ts). 'user' was never a real, assignable role —
// removed. 'manager' IS now a real orgRole, assignable via Pending
// Registrations approval, separate from the "Manager" label the UI also
// shows for any employee who simply has direct reports.
export type Role = 'admin' | 'employee' | 'manager' | 'training_provider';