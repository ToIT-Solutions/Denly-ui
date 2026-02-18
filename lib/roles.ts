export const ROLES = {
    OWNER: 'Owner',
    MANAGER: 'Manager',
    AGENT: 'Agent',
    VIEWER: 'Viewer',
  } as const
  
  // ---- Permission Groups ----
  
  // Can delete properties / users
  export const CAN_DELETE = [ROLES.OWNER]
  
  // Can view logs
  export const CAN_VIEW_LOGS = [ROLES.OWNER]
  
  // Can change user roles
  export const CAN_CHANGE_ROLES = [ROLES.OWNER]
  
  // Can edit properties
  export const CAN_EDIT = [ROLES.OWNER, ROLES.MANAGER]
  
  // Can view reports
  export const CAN_VIEW_REPORTS = [ROLES.OWNER, ROLES.MANAGER]
  
  // Can manage users (invite/remove)
  export const CAN_MANAGE_USERS = [ROLES.OWNER, ROLES.MANAGER]
  
  // Basically everyone except viewer
  export const CAN_INTERACT = [ROLES.OWNER, ROLES.MANAGER, ROLES.AGENT,]

  
/*
        -------------ROLES-----------------
        OWNER - EVERYTHING
        MANAGER - CANT DELETE/VIEW LOGS/CHANGE ROLES  
        AGENT - CANT DO ABOVE AND EDIT/ NO REPORTS 
        VIEWER - CAN ONLY VIEW 
*/