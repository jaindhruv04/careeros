import { prisma } from "../lib/prisma.js";

async function getUserAnalytics(req, res) {
  try {
    const userId = req.userId;

    const [dsaProblems, companies] = await Promise.all([
      prisma.dSAProblem.findMany({
        where: { userId, archived: false },
      }),
      prisma.company.findMany({
        where: { userId, archived: false },
      }),
    ]);

    const dsaAnalytics = calculateDSAAnalytics(dsaProblems);
    const companyAnalytics = calculateCompanyAnalytics(companies);
    const insights = generateInsights(dsaAnalytics, companyAnalytics);
    const recommendations = generateRecommendations(dsaAnalytics, companyAnalytics);

    return res.json({
      dsa: dsaAnalytics,
      companies: companyAnalytics,
      insights,
      recommendations,
    });
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

function calculateDSAAnalytics(problems) {
  const total = problems.length;
  const solved = problems.filter((p) => p.status === "Solved").length;
  const inProgress = problems.filter((p) => p.status === "In Progress").length;
  const notStarted = problems.filter((p) => p.status === "Not Started").length;

  const difficultyDist = {};
  const difficultySolved = {};
  const topicDist = {};
  const topicSolved = {};
  const needsRevision = problems.filter((p) => p.revisionNeeded).length;

  problems.forEach((p) => {
    difficultyDist[p.difficulty] = (difficultyDist[p.difficulty] || 0) + 1;
    topicDist[p.topic] = (topicDist[p.topic] || 0) + 1;
    if (p.status === "Solved") {
      difficultySolved[p.difficulty] = (difficultySolved[p.difficulty] || 0) + 1;
      topicSolved[p.topic] = (topicSolved[p.topic] || 0) + 1;
    }
  });

  const solveRateByDifficulty = {};
  Object.keys(difficultyDist).forEach((diff) => {
    solveRateByDifficulty[diff] =
      difficultyDist[diff] > 0
        ? Math.round(((difficultySolved[diff] || 0) / difficultyDist[diff]) * 100 * 100) / 100
        : 0;
  });

  const weakTopics = Object.keys(topicDist)
    .filter((topic) => topicDist[topic] >= 3)
    .map((topic) => ({
      topic,
      rate:
        topicDist[topic] > 0
          ? Math.round(((topicSolved[topic] || 0) / topicDist[topic]) * 100 * 100) / 100
          : 0,
    }))
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 5);

  const strongTopics = Object.keys(topicDist)
    .filter((topic) => topicDist[topic] >= 3)
    .map((topic) => ({
      topic,
      rate:
        topicDist[topic] > 0
          ? Math.round(((topicSolved[topic] || 0) / topicDist[topic]) * 100 * 100) / 100
          : 0,
    }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 5);

  const now = new Date();
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const recent7 = problems.filter((p) => p.createdAt >= last7Days && p.status === "Solved").length;
  const recent30 = problems.filter((p) => p.createdAt >= last30Days && p.status === "Solved").length;

  return {
    total,
    solved,
    inProgress,
    notStarted,
    solveRate: total > 0 ? Math.round((solved / total) * 100 * 100) / 100 : 0,
    difficultyDistribution: difficultyDist,
    solveRateByDifficulty,
    needsRevision,
    weakTopics,
    strongTopics,
    solvedLast7Days: recent7,
    solvedLast30Days: recent30,
    avgPerDay7d: Math.round((recent7 / 7) * 100) / 100,
    avgPerDay30d: Math.round((recent30 / 30) * 100) / 100,
  };
}

function calculateCompanyAnalytics(companies) {
  const total = companies.length;
  const statusDist = {};
  const priorityDist = {};

  companies.forEach((c) => {
    statusDist[c.status] = (statusDist[c.status] || 0) + 1;
    priorityDist[c.priority] = (priorityDist[c.priority] || 0) + 1;
  });

  const applied = statusDist.Applied || 0;
  const interviewing = statusDist.Interviewing || 0;
  const offer = statusDist.Offer || 0;
  const rejected = statusDist.Rejected || 0;

  const interviewConversion =
    applied > 0 ? Math.round((interviewing / applied) * 100 * 100) / 100 : 0;
  const offerConversion =
    interviewing + offer + rejected > 0
      ? Math.round((offer / (interviewing + offer + rejected)) * 100 * 100) / 100
      : 0;
  const overallSuccess = total > 0 ? Math.round((offer / total) * 100 * 100) / 100 : 0;

  const now = new Date();
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentApplications = companies.filter((c) => c.createdAt >= last30Days).length;

  return {
    total,
    statusDistribution: statusDist,
    priorityDistribution: priorityDist,
    interviewConversion,
    offerConversion,
    overallSuccess,
    applicationsLast30Days: recentApplications,
    avgPerDay30d: Math.round((recentApplications / 30) * 100) / 100,
  };
}

function generateInsights(dsa, company) {
  const insights = [];

  if (dsa.solveRate < 50) {
    insights.push("solve rate below target threshold");
  }

  if (dsa.needsRevision > 5) {
    insights.push(`${dsa.needsRevision} problems flagged for revision`);
  }

  if (dsa.avgPerDay7d < 1) {
    insights.push("activity declined in recent week");
  }

  if (dsa.weakTopics.length > 0) {
    const weakest = dsa.weakTopics[0];
    insights.push(`${weakest.topic} showing ${weakest.rate}% completion`);
  }

  if (company.interviewConversion < 20 && company.total > 5) {
    insights.push(`interview conversion at ${company.interviewConversion}%`);
  }

  if (company.applicationsLast30Days === 0) {
    insights.push("no recent applications tracked");
  }

  if (company.offerConversion > 0) {
    insights.push(`offer rate: ${company.offerConversion}%`);
  }

  return insights;
}

function generateRecommendations(dsa, company) {
  const recommendations = [];

  if ((dsa.solveRateByDifficulty.Hard || 0) < 30) {
    recommendations.push("increase hard problem coverage");
  }

  if (dsa.avgPerDay30d < 2) {
    const target = 3 - dsa.avgPerDay30d;
    recommendations.push(`target +${Math.round(target * 10) / 10} problems/day`);
  }

  if (dsa.weakTopics.length > 0) {
    recommendations.push(`focus areas: ${dsa.weakTopics.slice(0, 3).map((t) => t.topic).join(", ")}`);
  }

  if (company.total < 10) {
    recommendations.push("expand application pipeline");
  }

  const highPriority = company.priorityDistribution.High || 0;
  if (highPriority > 0) {
    recommendations.push(`${highPriority} high-priority followups pending`);
  }

  return recommendations;
}

export { getUserAnalytics };
