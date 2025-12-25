export const PROJECT_WORKFLOW = {
  "on-grid": [
    "lead-confirmed",
    "discom-database-ok",
    "bank-database-ok",
    "application-submitted",
    "work-started",
    "installation-detail-submitted",
    "meter-installed",
    "subsidy-requested",
    "wifi-configured",
  ],

  hybrid: [
    "lead-confirmed",
    "discom-database-ok",
    "bank-database-ok",
    "application-submitted",
    "work-started",
    "installation-detail-submitted",
    "meter-installed",
    "subsidy-requested",
    "wifi-configured",
  ],
  "off-grid": ["lead-confirmed", "work started", "completed"],
};
