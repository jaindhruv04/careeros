import argparse
import json
import os
import sys
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

# Look for .env in current directory, parent (root), or server folder
load_dotenv()
load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / "server" / ".env")


def get_db_connection(database_url: str):
    if not database_url:
        print(
            "Error: DATABASE_URL is not set. Provide it via environment variable, "
            ".env file, or --database-url argument.",
            file=sys.stderr
        )
        sys.exit(1)
    return psycopg2.connect(database_url)


def calculate_dsa_analytics(cur, user_id: int):
    cur.execute("""
        SELECT difficulty, status, topic, "revisionNeeded", "createdAt"
        FROM "DSAProblem"
        WHERE "userId" = %s AND archived = false
    """, (user_id,))
    
    problems = cur.fetchall()
    total = len(problems)
    solved = sum(1 for p in problems if p["status"] == "Solved")
    in_progress = sum(1 for p in problems if p["status"] == "In Progress")
    not_started = sum(1 for p in problems if p["status"] == "Not Started")
    needs_revision = sum(1 for p in problems if p.get("revisionNeeded"))

    difficulty_dist = defaultdict(int)
    difficulty_solved = defaultdict(int)
    topic_dist = defaultdict(int)
    topic_solved = defaultdict(int)

    for p in problems:
        difficulty_dist[p["difficulty"]] += 1
        topic_dist[p["topic"]] += 1
        if p["status"] == "Solved":
            difficulty_solved[p["difficulty"]] += 1
            topic_solved[p["topic"]] += 1

    solve_rate_by_difficulty = {
        diff: round((difficulty_solved[diff] / count) * 100, 2)
        for diff, count in difficulty_dist.items() if count > 0
    }

    weak_topics = sorted(
        [(topic, round((topic_solved[topic] / count) * 100, 2))
         for topic, count in topic_dist.items() if count >= 3],
        key=lambda x: x[1]
    )[:5]

    strong_topics = sorted(
        [(topic, round((topic_solved[topic] / count) * 100, 2))
         for topic, count in topic_dist.items() if count >= 3],
        key=lambda x: x[1],
        reverse=True
    )[:5]

    now = datetime.now(timezone.utc)
    last_7_days = now - timedelta(days=7)
    last_30_days = now - timedelta(days=30)

    recent_7 = sum(
        1 for p in problems 
        if p.get("createdAt") and p["createdAt"] >= last_7_days and p["status"] == "Solved"
    )
    recent_30 = sum(
        1 for p in problems 
        if p.get("createdAt") and p["createdAt"] >= last_30_days and p["status"] == "Solved"
    )

    return {
        "total_problems": total,
        "solved": solved,
        "in_progress": in_progress,
        "not_started": not_started,
        "solve_rate": round((solved / total) * 100, 2) if total > 0 else 0,
        "difficulty_distribution": dict(difficulty_dist),
        "solve_rate_by_difficulty": solve_rate_by_difficulty,
        "needs_revision": needs_revision,
        "weak_topics": weak_topics,
        "strong_topics": strong_topics,
        "solved_last_7_days": recent_7,
        "solved_last_30_days": recent_30,
        "avg_problems_per_day_7d": round(recent_7 / 7, 2),
        "avg_problems_per_day_30d": round(recent_30 / 30, 2)
    }


def calculate_company_analytics(cur, user_id: int):
    cur.execute("""
        SELECT status, priority, "createdAt"
        FROM "Company"
        WHERE "userId" = %s AND archived = false
    """, (user_id,))
    
    companies = cur.fetchall()
    total = len(companies)
    status_dist = defaultdict(int)
    priority_dist = defaultdict(int)

    for c in companies:
        status_dist[c["status"]] += 1
        priority_dist[c["priority"]] += 1

    applied = status_dist.get("Applied", 0)
    interviewing = status_dist.get("Interviewing", 0)
    offer = status_dist.get("Offer", 0)
    rejected = status_dist.get("Rejected", 0)

    interview_conversion = round((interviewing / applied) * 100, 2) if applied > 0 else 0
    funnel_completed = interviewing + offer + rejected
    offer_conversion = round((offer / funnel_completed) * 100, 2) if funnel_completed > 0 else 0
    overall_success = round((offer / total) * 100, 2) if total > 0 else 0

    now = datetime.now(timezone.utc)
    last_30_days = now - timedelta(days=30)
    recent_applications = sum(
        1 for c in companies 
        if c.get("createdAt") and c["createdAt"] >= last_30_days
    )

    return {
        "total_applications": total,
        "status_distribution": dict(status_dist),
        "priority_distribution": dict(priority_dist),
        "interview_conversion_rate": interview_conversion,
        "offer_conversion_rate": offer_conversion,
        "overall_success_rate": overall_success,
        "applications_last_30_days": recent_applications,
        "avg_applications_per_day_30d": round(recent_applications / 30, 2)
    }


def generate_insights(dsa_data, company_data):
    insights = []
    if dsa_data["solve_rate"] < 50:
        insights.append("DSA solve rate is below target (50%)")
    if dsa_data["needs_revision"] > 5:
        insights.append(f"{dsa_data['needs_revision']} problems flagged for revision")
    if dsa_data["avg_problems_per_day_7d"] < 1:
        insights.append("DSA activity declined in recent week (< 1/day)")
    if dsa_data["weak_topics"]:
        weakest = dsa_data["weak_topics"][0]
        insights.append(f"Focus area: '{weakest[0]}' has low completion ({weakest[1]}%)")
    if company_data["interview_conversion_rate"] < 20 and company_data["total_applications"] > 5:
        insights.append(f"Interview conversion is {company_data['interview_conversion_rate']}%")
    if company_data["applications_last_30_days"] == 0:
        insights.append("No applications tracked in the last 30 days")
    if company_data["offer_conversion_rate"] > 0:
        insights.append(f"Offer conversion rate: {company_data['offer_conversion_rate']}%")
    return insights


def generate_recommendations(dsa_data, company_data):
    recommendations = []
    if dsa_data["solve_rate_by_difficulty"].get("Hard", 0) < 30:
        recommendations.append("Increase coverage of Hard problems")
    if dsa_data["avg_problems_per_day_30d"] < 2:
        target = 3 - dsa_data["avg_problems_per_day_30d"]
        recommendations.append(f"Aim for +{round(target, 1)} problems/day to reach steady pace")
    if dsa_data["weak_topics"]:
        recommendations.append(f"Prioritize topics: {', '.join([t[0] for t in dsa_data['weak_topics'][:3]])}")
    if company_data["total_applications"] < 10:
        recommendations.append("Expand application pipeline")
    high_priority = company_data["priority_distribution"].get("High", 0)
    if high_priority > 0:
        recommendations.append(f"{high_priority} high-priority company followups pending")
    return recommendations


def main():
    parser = argparse.ArgumentParser(description="CareerOS Analytics & Reporting CLI")
    parser.add_argument("--user-id", type=int, help="Target User ID to generate report for")
    parser.add_argument("--database-url", type=str, default=os.getenv("DATABASE_URL"), help="Database connection string")
    parser.add_argument("--output", type=str, help="Output JSON path (optional)")
    args = parser.parse_args()

    user_id = args.user_id
    if user_id is None:
        try:
            raw_input = input("Enter User ID: ").strip()
            user_id = int(raw_input)
        except (ValueError, EOFError):
            print("Invalid User ID. Must be an integer.", file=sys.stderr)
            sys.exit(1)

    database_url = args.database_url
    print(f"\nConnecting to database and generating report for user {user_id}...\n")

    try:
        with get_db_connection(database_url) as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                dsa_analytics = calculate_dsa_analytics(cur, user_id)
                company_analytics = calculate_company_analytics(cur, user_id)
    except Exception as e:
        print(f"Database error: {e}", file=sys.stderr)
        sys.exit(1)

    insights = generate_insights(dsa_analytics, company_analytics)
    recommendations = generate_recommendations(dsa_analytics, company_analytics)

    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "user_id": user_id,
        "dsa_analytics": dsa_analytics,
        "company_analytics": company_analytics,
        "insights": insights,
        "recommendations": recommendations
    }

    output_file = args.output or f"report_{user_id}.json"
    with open(output_file, "w") as f:
        json.dump(report, f, indent=2, default=str)

    print(f"Report saved to {output_file}\n")
    print("=== Summary ===")
    print(f"DSA: {dsa_analytics['solved']}/{dsa_analytics['total_problems']} solved ({dsa_analytics['solve_rate']}%)")
    print(f"Applications: {company_analytics['total_applications']} total | {company_analytics['interview_conversion_rate']}% interview rate")
    if insights:
        print("\nKey Insights:")
        for i in insights:
            print(f"  - {i}")
    if recommendations:
        print("\nAction Items:")
        for r in recommendations:
            print(f"  - {r}")


if __name__ == "__main__":
    main()
