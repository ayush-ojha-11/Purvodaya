export const PROJECT_WORKFLOW = {
  "on-grid": {
    cash: [
      "application-submitted",
      "work-started",
      "installation-detail-submitted",
      "meter-installed",
      "subsidy-requested",
      "wifi-configured",
    ],
    loan: [
      "application-submitted",
      "loan", // extra step
      "work-started",
      "installation-detail-submitted",
      "meter-installed",
      "subsidy-requested",
      "wifi-configured",
    ],
  },
  hybrid: {
    cash: [
      "application-submitted",
      "work-started",
      "installation-detail-submitted",
      "meter-installed",
      "subsidy-requested",
      "wifi-configured",
    ],
    loan: [
      "application-submitted",
      "loan", // extra step
      "work-started",
      "installation-detail-submitted",
      "meter-installed",
      "subsidy-requested",
      "wifi-configured",
    ],
  },
  "off-grid": {
    cash: ["application-submitted", "work-started", "completed"],
    loan: ["application-submitted", "loan", "work-started", "completed"],
  },
};
