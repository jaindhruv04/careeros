// src/utils/dashboardUtils.js

export function getOverallStats(
  companies,
  dsaTopics,
  interviewEntries,
  projects
) {
  return {
    totalCompanies: companies.length,
    totalDSA: dsaTopics.length,
    totalInterviews: interviewEntries.length,
    totalProjects: projects.length,
  };
}

export function getHighPriorityItems(
  companies,
  dsaTopics,
  interviewEntries,
  projects
) {
  return {
    companies: companies.filter(
      (company) => company.priority === "High"
    ),

    dsaTopics: dsaTopics.filter(
      (problem) => problem.priority === "High"
    ),

    interviews: interviewEntries.filter(
      (entry) => entry.priority === "High"
    ),

    projects: projects.filter(
      (project) => project.priority === "High"
    ),
  };
}

export function getProgressStats(
  companies,
  dsaTopics,
  interviewEntries,
  projects
) {
  const offers = companies.filter(
    (company) => company.status === "Offer"
  ).length;

  const solved = dsaTopics.filter(
    (problem) => problem.status === "Solved"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  return {
    companySuccessRate:
      companies.length === 0
        ? 0
        : ((offers / companies.length) * 100).toFixed(1),

    dsaSolvedRate:
      dsaTopics.length === 0
        ? 0
        : ((solved / dsaTopics.length) * 100).toFixed(1),

    projectCompletionRate:
      projects.length === 0
        ? 0
        : ((completedProjects / projects.length) * 100).toFixed(1),

    totalOffers: offers,
    solvedProblems: solved,
    completedProjects,
    totalInterviews: interviewEntries.length,
  };
}

export function getRecentActivity(
  companies,
  dsaTopics,
  interviewEntries,
  projects
) {
  const allItems = [
    ...companies.map((company) => ({
      type: "Company",
      title: company.name,
      priority: company.priority,
      dateAdded: company.dateAdded,
      timestamp: company.id,
    })),

    ...dsaTopics.map((problem) => ({
      type: "DSA",
      title: problem.name,
      priority: problem.priority,
      dateAdded: problem.dateAdded,
      timestamp: problem.id,
    })),

    ...interviewEntries.map((entry) => ({
      type: "Interview",
      title: entry.company,
      priority: entry.priority,
      dateAdded: entry.dateAdded,
      timestamp: entry.id,
    })),

    ...projects.map((project) => ({
      type: "Project",
      title: project.name,
      priority: project.priority,
      dateAdded: project.dateAdded,
      timestamp: project.id,
    })),
  ];

  return allItems
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);
}

export function getQuickInsights(
  companies,
  dsaTopics,
  interviewEntries,
  projects
) {
  const highPriorityItems =
    companies.filter((company) => company.priority === "High").length +
    dsaTopics.filter((problem) => problem.priority === "High").length +
    interviewEntries.filter((entry) => entry.priority === "High").length +
    projects.filter((project) => project.priority === "High").length;

  const revisionProblems = dsaTopics.filter(
    (problem) => problem.revisionNeeded
  ).length;

  const offers = companies.filter(
    (company) => company.status === "Offer"
  ).length;

  const onHoldProjects = projects.filter(
    (project) => project.status === "On Hold"
  ).length;

  return {
    highPriorityItems,
    revisionProblems,
    offers,
    onHoldProjects,
  };
}