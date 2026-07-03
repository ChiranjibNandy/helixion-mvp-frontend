export const API = {
   AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REGISTER: '/auth/register',
      SEND_PASSWORD_RESET_LINK: '/auth/send-reset-link',
      RESET_PASSWORD: '/auth/reset-password'
   },
   ADMIN: {
      USERS: '/admin/users',
      REGISTRATIONS: '/admin/registrations',
      USERS_SEARCH: '/admin/users/search',
      BATCH_CREATE: '/admin/users/batch',
      DEACTIVATE_USER: (id: string) => `/admin/users/${id}/deactivate`,
   },
   EMPLOYEE: {
      DASHBOARD: '/employee/dashboard',
      PROGRAMS:  '/employee/programs',
      ENROLL:    (id: string) => `/employee/programs/${id}/enroll`,
      ENROLLMENTS: '/employee/enrollments',
      ENROLLMENT_DETAILS: (id: string) => `/employee/enrollments/${id}`,
      UPDATE_TRAVEL: (id: string) => `/employee/enrollments/${id}/travel`,
      SUBMIT_ENROLLMENT: (id: string) => `/employee/enrollments/${id}/submit`,
   },
   MANAGER: {
      DASHBOARD: '/manager/dashboard',
      ENROLLMENTS:"/manager/enrollments"
   },
   TRAININGPROVIDER: {
      CREATEPROGRAM:    '/training-provider/create/program',
      PROGRAMS:         '/training-provider/programs',
      PARTICIPANTS:     (id: string) => `/training-provider/programs/${id}/participants`,
      ATTENDANCE:       (id: string) => `/training-provider/programs/${id}/attendance`,
      ATTENDANCE_SINGLE:(id: string, pid: string) => `/training-provider/programs/${id}/attendance/${pid}`
   }
}
