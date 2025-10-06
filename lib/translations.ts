export type Language = 'fr' | 'en';

export interface Translations {
  // Navigation
  navigation: {
    dashboard: string;
    services: string;
    calendar: string;
    availability: string;
    swap: string;
    settings: string;
    emailManagement: string;
    users: string;
    roles: string;
    reports: string;
    swapRequests: string;
  };
  
  // Common
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    filter: string;
    loading: string;
    error: string;
    success: string;
    confirm: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    submit: string;
    reset: string;
    view: string;
    create: string;
    update: string;
    remove: string;
    select: string;
    required: string;
    optional: string;
    yes: string;
    no: string;
    ok: string;
  };

  // Auth
  auth: {
    login: string;
    logout: string;
    register: string;
    signup: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone: string;
    rememberMe: string;
    forgotPassword: string;
    resetPassword: string;
    createAccount: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    adminSignup: string;
    userSignup: string;
    loginSuccess: string;
    loginError: string;
    registrationSuccess: string;
    registrationError: string;
    invalidCredentials: string;
    accountCreated: string;
    passwordReset: string;
    passwordResetSent: string;
  };

  // Dashboard
  dashboard: {
    title: string;
    welcome: string;
    upcomingServices: string;
    myServices: string;
    availability: string;
    notifications: string;
    stats: string;
    totalServices: string;
    totalUsers: string;
    pendingRequests: string;
    recentActivity: string;
  };

  // Services
  services: {
    title: string;
    createService: string;
    editService: string;
    deleteService: string;
    serviceTitle: string;
    description: string;
    date: string;
    time: string;
    location: string;
    status: string;
    published: string;
    draft: string;
    cancelled: string;
    assignedUsers: string;
    roles: string;
    addRole: string;
    removeRole: string;
    assignUser: string;
    unassignUser: string;
    serviceDetails: string;
    noServices: string;
    upcomingServices: string;
    pastServices: string;
  };

  // Users
  users: {
    title: string;
    createUser: string;
    editUser: string;
    deleteUser: string;
    userDetails: string;
    role: string;
    admin: string;
    user: string;
    active: string;
    inactive: string;
    lastLogin: string;
    joinedDate: string;
    noUsers: string;
    userManagement: string;
    userProfile: string;
  };

  // Email
  email: {
    title: string;
    settings: string;
    templates: string;
    testEmail: string;
    sendTest: string;
    fromEmail: string;
    fromName: string;
    replyTo: string;
    apiKey: string;
    configuration: string;
    status: string;
    working: string;
    notWorking: string;
    testConnection: string;
    emailSent: string;
    emailFailed: string;
    notifications: string;
    enableNotifications: string;
    reminderTime: string;
    hoursBefore: string;
  };

  // Calendar
  calendar: {
    title: string;
    month: string;
    week: string;
    day: string;
    today: string;
    previous: string;
    next: string;
    noEvents: string;
    serviceDetails: string;
    time: string;
    location: string;
    participants: string;
  };

  // Availability
  availability: {
    title: string;
    setAvailability: string;
    available: string;
    unavailable: string;
    maybe: string;
    date: string;
    status: string;
    notes: string;
    updateAvailability: string;
    availabilityUpdated: string;
  };

  // Swap
  swap: {
    title: string;
    requestSwap: string;
    swapRequests: string;
    mySwaps: string;
    requestSwapFor: string;
    reason: string;
    requestSwap: string;
    approveSwap: string;
    rejectSwap: string;
    swapApproved: string;
    swapRejected: string;
    swapRequested: string;
    noSwaps: string;
    pendingApproval: string;
  };

  // Settings
  settings: {
    title: string;
    profile: string;
    account: string;
    preferences: string;
    notifications: string;
    email: string;
    password: string;
    changePassword: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    updateProfile: string;
    profileUpdated: string;
    settingsSaved: string;
  };

  // Reports
  reports: {
    title: string;
    generateReport: string;
    serviceReport: string;
    userReport: string;
    attendanceReport: string;
    dateRange: string;
    from: string;
    to: string;
    export: string;
    print: string;
    noData: string;
  };

  // Roles
  roles: {
    title: string;
    createRole: string;
    editRole: string;
    deleteRole: string;
    roleName: string;
    roleDescription: string;
    color: string;
    noRoles: string;
    roleManagement: string;
  };

  // Notifications
  notifications: {
    title: string;
    newNotification: string;
    markAsRead: string;
    markAllAsRead: string;
    noNotifications: string;
    serviceReminder: string;
    swapRequest: string;
    swapApproved: string;
    swapRejected: string;
    serviceAssigned: string;
    serviceCancelled: string;
  };

  // Errors
  errors: {
    pageNotFound: string;
    serverError: string;
    unauthorized: string;
    forbidden: string;
    badRequest: string;
    notFound: string;
    internalError: string;
    networkError: string;
    validationError: string;
    emailError: string;
    databaseError: string;
  };

  // Success messages
  success: {
    saved: string;
    deleted: string;
    updated: string;
    created: string;
    sent: string;
    emailSent: string;
    notificationSent: string;
    swapApproved: string;
    swapRejected: string;
    availabilityUpdated: string;
  };
}

export const translations: Record<Language, Translations> = {
  fr: {
    navigation: {
      dashboard: "Tableau de bord",
      services: "Services",
      calendar: "Calendrier",
      availability: "Disponibilité",
      swap: "Échange",
      settings: "Paramètres",
      emailManagement: "Gestion Email",
      users: "Utilisateurs",
      roles: "Rôles",
      reports: "Rapports",
      swapRequests: "Demandes d'échange"
    },
    common: {
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      edit: "Modifier",
      add: "Ajouter",
      search: "Rechercher",
      filter: "Filtrer",
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      confirm: "Confirmer",
      back: "Retour",
      next: "Suivant",
      previous: "Précédent",
      close: "Fermer",
      submit: "Soumettre",
      reset: "Réinitialiser",
      view: "Voir",
      create: "Créer",
      update: "Mettre à jour",
      remove: "Supprimer",
      select: "Sélectionner",
      required: "Requis",
      optional: "Optionnel",
      yes: "Oui",
      no: "Non",
      ok: "OK"
    },
    auth: {
      login: "Connexion",
      logout: "Déconnexion",
      register: "S'inscrire",
      signup: "Créer un compte",
      email: "Email",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      firstName: "Prénom",
      lastName: "Nom",
      phone: "Téléphone",
      rememberMe: "Se souvenir de moi",
      forgotPassword: "Mot de passe oublié ?",
      resetPassword: "Réinitialiser le mot de passe",
      createAccount: "Créer un compte",
      alreadyHaveAccount: "Déjà un compte ?",
      dontHaveAccount: "Pas encore de compte ?",
      adminSignup: "Inscription Admin",
      userSignup: "Inscription Intervenant",
      loginSuccess: "Connexion réussie",
      loginError: "Erreur de connexion",
      registrationSuccess: "Inscription réussie",
      registrationError: "Erreur d'inscription",
      invalidCredentials: "Email ou mot de passe incorrect",
      accountCreated: "Compte créé avec succès",
      passwordReset: "Réinitialisation du mot de passe",
      passwordResetSent: "Email de réinitialisation envoyé"
    },
    dashboard: {
      title: "Tableau de bord",
      welcome: "Bienvenue",
      upcomingServices: "Services à venir",
      myServices: "Mes services",
      availability: "Disponibilité",
      notifications: "Notifications",
      stats: "Statistiques",
      totalServices: "Total des services",
      totalUsers: "Total des utilisateurs",
      pendingRequests: "Demandes en attente",
      recentActivity: "Activité récente"
    },
    services: {
      title: "Services",
      createService: "Créer un service",
      editService: "Modifier le service",
      deleteService: "Supprimer le service",
      serviceTitle: "Titre du service",
      description: "Description",
      date: "Date",
      time: "Heure",
      location: "Lieu",
      status: "Statut",
      published: "Publié",
      draft: "Brouillon",
      cancelled: "Annulé",
      assignedUsers: "Utilisateurs assignés",
      roles: "Rôles",
      addRole: "Ajouter un rôle",
      removeRole: "Supprimer le rôle",
      assignUser: "Assigner un utilisateur",
      unassignUser: "Désassigner un utilisateur",
      serviceDetails: "Détails du service",
      noServices: "Aucun service",
      upcomingServices: "Services à venir",
      pastServices: "Services passés"
    },
    users: {
      title: "Utilisateurs",
      createUser: "Créer un utilisateur",
      editUser: "Modifier l'utilisateur",
      deleteUser: "Supprimer l'utilisateur",
      userDetails: "Détails de l'utilisateur",
      role: "Rôle",
      admin: "Administrateur",
      user: "Utilisateur",
      active: "Actif",
      inactive: "Inactif",
      lastLogin: "Dernière connexion",
      joinedDate: "Date d'inscription",
      noUsers: "Aucun utilisateur",
      userManagement: "Gestion des utilisateurs",
      userProfile: "Profil utilisateur"
    },
    email: {
      title: "Gestion des Emails",
      settings: "Paramètres Email",
      templates: "Modèles d'email",
      testEmail: "Email de test",
      sendTest: "Envoyer un test",
      fromEmail: "Email d'expéditeur",
      fromName: "Nom d'expéditeur",
      replyTo: "Répondre à",
      apiKey: "Clé API",
      configuration: "Configuration",
      status: "Statut",
      working: "Fonctionnel",
      notWorking: "Non fonctionnel",
      testConnection: "Tester la connexion",
      emailSent: "Email envoyé",
      emailFailed: "Échec de l'envoi",
      notifications: "Notifications",
      enableNotifications: "Activer les notifications",
      reminderTime: "Heure de rappel",
      hoursBefore: "heures avant"
    },
    calendar: {
      title: "Calendrier",
      month: "Mois",
      week: "Semaine",
      day: "Jour",
      today: "Aujourd'hui",
      previous: "Précédent",
      next: "Suivant",
      noEvents: "Aucun événement",
      serviceDetails: "Détails du service",
      time: "Heure",
      location: "Lieu",
      participants: "Participants"
    },
    availability: {
      title: "Disponibilité",
      setAvailability: "Définir la disponibilité",
      available: "Disponible",
      unavailable: "Indisponible",
      maybe: "Peut-être",
      date: "Date",
      status: "Statut",
      notes: "Notes",
      updateAvailability: "Mettre à jour la disponibilité",
      availabilityUpdated: "Disponibilité mise à jour"
    },
    swap: {
      title: "Échange",
      requestSwap: "Demander un échange",
      swapRequests: "Demandes d'échange",
      mySwaps: "Mes échanges",
      requestSwapFor: "Demander un échange pour",
      reason: "Raison",
      requestSwap: "Demander l'échange",
      approveSwap: "Approuver l'échange",
      rejectSwap: "Rejeter l'échange",
      swapApproved: "Échange approuvé",
      swapRejected: "Échange rejeté",
      swapRequested: "Échange demandé",
      noSwaps: "Aucun échange",
      pendingApproval: "En attente d'approbation"
    },
    settings: {
      title: "Paramètres",
      profile: "Profil",
      account: "Compte",
      preferences: "Préférences",
      notifications: "Notifications",
      email: "Email",
      password: "Mot de passe",
      changePassword: "Changer le mot de passe",
      currentPassword: "Mot de passe actuel",
      newPassword: "Nouveau mot de passe",
      confirmNewPassword: "Confirmer le nouveau mot de passe",
      updateProfile: "Mettre à jour le profil",
      profileUpdated: "Profil mis à jour",
      settingsSaved: "Paramètres sauvegardés"
    },
    reports: {
      title: "Rapports",
      generateReport: "Générer un rapport",
      serviceReport: "Rapport de service",
      userReport: "Rapport d'utilisateur",
      attendanceReport: "Rapport de présence",
      dateRange: "Période",
      from: "Du",
      to: "Au",
      export: "Exporter",
      print: "Imprimer",
      noData: "Aucune donnée"
    },
    roles: {
      title: "Rôles",
      createRole: "Créer un rôle",
      editRole: "Modifier le rôle",
      deleteRole: "Supprimer le rôle",
      roleName: "Nom du rôle",
      roleDescription: "Description du rôle",
      color: "Couleur",
      noRoles: "Aucun rôle",
      roleManagement: "Gestion des rôles"
    },
    notifications: {
      title: "Notifications",
      newNotification: "Nouvelle notification",
      markAsRead: "Marquer comme lu",
      markAllAsRead: "Tout marquer comme lu",
      noNotifications: "Aucune notification",
      serviceReminder: "Rappel de service",
      swapRequest: "Demande d'échange",
      swapApproved: "Échange approuvé",
      swapRejected: "Échange rejeté",
      serviceAssigned: "Service assigné",
      serviceCancelled: "Service annulé"
    },
    errors: {
      pageNotFound: "Page non trouvée",
      serverError: "Erreur du serveur",
      unauthorized: "Non autorisé",
      forbidden: "Interdit",
      badRequest: "Mauvaise requête",
      notFound: "Non trouvé",
      internalError: "Erreur interne",
      networkError: "Erreur réseau",
      validationError: "Erreur de validation",
      emailError: "Erreur d'email",
      databaseError: "Erreur de base de données"
    },
    success: {
      saved: "Sauvegardé",
      deleted: "Supprimé",
      updated: "Mis à jour",
      created: "Créé",
      sent: "Envoyé",
      emailSent: "Email envoyé",
      notificationSent: "Notification envoyée",
      swapApproved: "Échange approuvé",
      swapRejected: "Échange rejeté",
      availabilityUpdated: "Disponibilité mise à jour"
    }
  },
  en: {
    navigation: {
      dashboard: "Dashboard",
      services: "Services",
      calendar: "Calendar",
      availability: "Availability",
      swap: "Swap",
      settings: "Settings",
      emailManagement: "Email Management",
      users: "Users",
      roles: "Roles",
      reports: "Reports",
      swapRequests: "Swap Requests"
    },
    common: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      search: "Search",
      filter: "Filter",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      confirm: "Confirm",
      back: "Back",
      next: "Next",
      previous: "Previous",
      close: "Close",
      submit: "Submit",
      reset: "Reset",
      view: "View",
      create: "Create",
      update: "Update",
      remove: "Remove",
      select: "Select",
      required: "Required",
      optional: "Optional",
      yes: "Yes",
      no: "No",
      ok: "OK"
    },
    auth: {
      login: "Login",
      logout: "Logout",
      register: "Register",
      signup: "Sign Up",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone",
      rememberMe: "Remember Me",
      forgotPassword: "Forgot Password?",
      resetPassword: "Reset Password",
      createAccount: "Create Account",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      adminSignup: "Admin Signup",
      userSignup: "User Signup",
      loginSuccess: "Login successful",
      loginError: "Login error",
      registrationSuccess: "Registration successful",
      registrationError: "Registration error",
      invalidCredentials: "Invalid email or password",
      accountCreated: "Account created successfully",
      passwordReset: "Password reset",
      passwordResetSent: "Password reset email sent"
    },
    dashboard: {
      title: "Dashboard",
      welcome: "Welcome",
      upcomingServices: "Upcoming Services",
      myServices: "My Services",
      availability: "Availability",
      notifications: "Notifications",
      stats: "Statistics",
      totalServices: "Total Services",
      totalUsers: "Total Users",
      pendingRequests: "Pending Requests",
      recentActivity: "Recent Activity"
    },
    services: {
      title: "Services",
      createService: "Create Service",
      editService: "Edit Service",
      deleteService: "Delete Service",
      serviceTitle: "Service Title",
      description: "Description",
      date: "Date",
      time: "Time",
      location: "Location",
      status: "Status",
      published: "Published",
      draft: "Draft",
      cancelled: "Cancelled",
      assignedUsers: "Assigned Users",
      roles: "Roles",
      addRole: "Add Role",
      removeRole: "Remove Role",
      assignUser: "Assign User",
      unassignUser: "Unassign User",
      serviceDetails: "Service Details",
      noServices: "No Services",
      upcomingServices: "Upcoming Services",
      pastServices: "Past Services"
    },
    users: {
      title: "Users",
      createUser: "Create User",
      editUser: "Edit User",
      deleteUser: "Delete User",
      userDetails: "User Details",
      role: "Role",
      admin: "Admin",
      user: "User",
      active: "Active",
      inactive: "Inactive",
      lastLogin: "Last Login",
      joinedDate: "Joined Date",
      noUsers: "No Users",
      userManagement: "User Management",
      userProfile: "User Profile"
    },
    email: {
      title: "Email Management",
      settings: "Email Settings",
      templates: "Email Templates",
      testEmail: "Test Email",
      sendTest: "Send Test",
      fromEmail: "From Email",
      fromName: "From Name",
      replyTo: "Reply To",
      apiKey: "API Key",
      configuration: "Configuration",
      status: "Status",
      working: "Working",
      notWorking: "Not Working",
      testConnection: "Test Connection",
      emailSent: "Email Sent",
      emailFailed: "Email Failed",
      notifications: "Notifications",
      enableNotifications: "Enable Notifications",
      reminderTime: "Reminder Time",
      hoursBefore: "hours before"
    },
    calendar: {
      title: "Calendar",
      month: "Month",
      week: "Week",
      day: "Day",
      today: "Today",
      previous: "Previous",
      next: "Next",
      noEvents: "No Events",
      serviceDetails: "Service Details",
      time: "Time",
      location: "Location",
      participants: "Participants"
    },
    availability: {
      title: "Availability",
      setAvailability: "Set Availability",
      available: "Available",
      unavailable: "Unavailable",
      maybe: "Maybe",
      date: "Date",
      status: "Status",
      notes: "Notes",
      updateAvailability: "Update Availability",
      availabilityUpdated: "Availability Updated"
    },
    swap: {
      title: "Swap",
      requestSwap: "Request Swap",
      swapRequests: "Swap Requests",
      mySwaps: "My Swaps",
      requestSwapFor: "Request Swap For",
      reason: "Reason",
      requestSwap: "Request Swap",
      approveSwap: "Approve Swap",
      rejectSwap: "Reject Swap",
      swapApproved: "Swap Approved",
      swapRejected: "Swap Rejected",
      swapRequested: "Swap Requested",
      noSwaps: "No Swaps",
      pendingApproval: "Pending Approval"
    },
    settings: {
      title: "Settings",
      profile: "Profile",
      account: "Account",
      preferences: "Preferences",
      notifications: "Notifications",
      email: "Email",
      password: "Password",
      changePassword: "Change Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmNewPassword: "Confirm New Password",
      updateProfile: "Update Profile",
      profileUpdated: "Profile Updated",
      settingsSaved: "Settings Saved"
    },
    reports: {
      title: "Reports",
      generateReport: "Generate Report",
      serviceReport: "Service Report",
      userReport: "User Report",
      attendanceReport: "Attendance Report",
      dateRange: "Date Range",
      from: "From",
      to: "To",
      export: "Export",
      print: "Print",
      noData: "No Data"
    },
    roles: {
      title: "Roles",
      createRole: "Create Role",
      editRole: "Edit Role",
      deleteRole: "Delete Role",
      roleName: "Role Name",
      roleDescription: "Role Description",
      color: "Color",
      noRoles: "No Roles",
      roleManagement: "Role Management"
    },
    notifications: {
      title: "Notifications",
      newNotification: "New Notification",
      markAsRead: "Mark as Read",
      markAllAsRead: "Mark All as Read",
      noNotifications: "No Notifications",
      serviceReminder: "Service Reminder",
      swapRequest: "Swap Request",
      swapApproved: "Swap Approved",
      swapRejected: "Swap Rejected",
      serviceAssigned: "Service Assigned",
      serviceCancelled: "Service Cancelled"
    },
    errors: {
      pageNotFound: "Page Not Found",
      serverError: "Server Error",
      unauthorized: "Unauthorized",
      forbidden: "Forbidden",
      badRequest: "Bad Request",
      notFound: "Not Found",
      internalError: "Internal Error",
      networkError: "Network Error",
      validationError: "Validation Error",
      emailError: "Email Error",
      databaseError: "Database Error"
    },
    success: {
      saved: "Saved",
      deleted: "Deleted",
      updated: "Updated",
      created: "Created",
      sent: "Sent",
      emailSent: "Email Sent",
      notificationSent: "Notification Sent",
      swapApproved: "Swap Approved",
      swapRejected: "Swap Rejected",
      availabilityUpdated: "Availability Updated"
    }
  }
};

export function getTranslation(language: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key;
}

export function useTranslation(language: Language = 'fr') {
  return {
    t: (key: string) => getTranslation(language, key),
    language
  };
}
