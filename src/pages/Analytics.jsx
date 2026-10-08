import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";
import ModuleHeader from "../components/ModuleHeader";

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      const res = await apiFetch("/analytics");
      if (res.ok) {
        const analytics = await res.json();
        setData(analytics);
      }
      setLoading(false);
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-5xl">
        <ModuleHeader label="Analytics" />
        <p className="text-text-muted">loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full max-w-5xl">
        <ModuleHeader label="Analytics" />
        <p className="text-text-muted">no data available</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl">
      <ModuleHeader label="Analytics" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-lg font-medium text-text-primary mb-4">DSA Performance</h2>
          <div className="space-y-2 text-sm">
            <p className="text-text-muted">
              <span className="text-text-primary font-medium">{data.dsa.solved}</span> / {data.dsa.total} solved
              <span className="ml-2 text-accent">({data.dsa.solveRate}%)</span>
            </p>
            <p className="text-text-muted">{data.dsa.inProgress} in progress</p>
            <p className="text-text-muted">{data.dsa.needsRevision} need revision</p>
            <p className="text-text-muted">{data.dsa.solvedLast7Days} solved last 7d</p>
            <p className="text-text-muted">
              <span className="text-text-primary font-medium">{data.dsa.avgPerDay30d}</span> problems/day avg
            </p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-lg font-medium text-text-primary mb-4">Company Applications</h2>
          <div className="space-y-2 text-sm">
            <p className="text-text-muted">
              <span className="text-text-primary font-medium">{data.companies.total}</span> total applications
            </p>
            <p className="text-text-muted">
              {data.companies.statusDistribution.Applied || 0} applied |{" "}
              {data.companies.statusDistribution.Interviewing || 0} interviewing |{" "}
              {data.companies.statusDistribution.Offer || 0} offers
            </p>
            <p className="text-text-muted">
              Interview conversion:{" "}
              <span className="text-text-primary font-medium">{data.companies.interviewConversion}%</span>
            </p>
            <p className="text-text-muted">
              Offer conversion:{" "}
              <span className="text-text-primary font-medium">{data.companies.offerConversion}%</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-lg font-medium text-text-primary mb-4">Solve Rate by Difficulty</h2>
          <div className="space-y-2 text-sm">
            {Object.entries(data.dsa.solveRateByDifficulty).map(([diff, rate]) => (
              <div key={diff} className="flex justify-between">
                <span className="text-text-muted">{diff}</span>
                <span className="text-text-primary font-medium">{rate}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-lg font-medium text-text-primary mb-4">Weak Topics</h2>
          {data.dsa.weakTopics.length > 0 ? (
            <div className="space-y-2 text-sm">
              {data.dsa.weakTopics.map((topic) => (
                <div key={topic.topic} className="flex justify-between">
                  <span className="text-text-muted">{topic.topic}</span>
                  <span className="text-warning font-medium">{topic.rate}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted">no weak topics identified</p>
          )}
        </div>
      </div>

      {data.insights.length > 0 && (
        <div className="bg-surface border border-border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-text-primary mb-4">Insights</h2>
          <ul className="space-y-2 text-sm">
            {data.insights.map((insight, i) => (
              <li key={i} className="text-text-muted">
                • {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.recommendations.length > 0 && (
        <div className="bg-surface border border-accent rounded-lg p-6">
          <h2 className="text-lg font-medium text-accent mb-4">Recommendations</h2>
          <ul className="space-y-2 text-sm">
            {data.recommendations.map((rec, i) => (
              <li key={i} className="text-text-muted">
                • {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Analytics;
