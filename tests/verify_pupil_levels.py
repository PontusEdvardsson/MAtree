"""Check consistency of recorded pupil tests; does not run or grade new app attempts."""
import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def read(name):
    return json.loads((ROOT / name).read_text(encoding="utf-8-sig"))


def stored_summary(session, items):
    assert session["endReason"] == "all-tested"
    assert session["selection"] == "course"
    assert session["catalogue"] == "assessed"
    assert session["coveragePolicy"] == "exhaustive"
    assert session["scope"] == "8" and session["category"] == "sannolikhet"
    assert session["limit"] == 60 and not session["known"]
    groups = defaultdict(list)
    for item in items:
        groups[item["nodeId"]].append(item)
    return {
        "answers": len(items),
        "correct": sum(bool(x.get("correct")) for x in items),
        "skipped": sum(bool(x.get("skipped")) for x in items),
        "endEvidence": "stored all-tested and rendered summary",
        "skills": {
            key: {"correct": sum(bool(x.get("correct")) for x in xs), "total": len(xs)}
            for key, xs in groups.items()
        },
    }


def main():
    low = read("pupil-low-sample.json")
    strong = read("pupil-strong-sample.json")
    mixed = read("pupil-mixed-sample.json")
    low_summary = stored_summary(low["postCompletion"]["session"], low["postCompletion"]["items"])
    profiles = strong["storedAfterCompletion"]["matree.profiles.v1"]["profiles"]
    assert len(profiles) == 1, "Only the isolated fictional profile belongs in this sample"
    strong_session = profiles[0]["adaptive"]["sessions"][-1]
    strong_summary = stored_summary(strong_session, strong_session["items"])
    assert len(low["questions"]) == low_summary["answers"]
    assert not low["errors"]
    assert len(strong["transcript"]) == strong_summary["answers"]
    assert len(mixed["sample"]["rows"]) == mixed["statistics"]["answers"] == 33
    assert mixed["scope"]["naturalEnd"] and mixed["scope"]["limit"] == 60
    mixed_summary = {
        "answers": mixed["statistics"]["answers"],
        "correct": mixed["statistics"]["correct"],
        "skipped": mixed["statistics"]["abstentions"],
        "endEvidence": "rendered summary: all selected skills tested; no storage export",
        "skills": {x["momentId"]: {"correct": x["correct"], "total": x["total"]} for x in mixed["outcomes"]},
    }
    assert sum(x["reserveGuess"] for x in mixed["sample"]["rows"]) == 1
    assert len(mixed_summary["skills"]) == 11
    result = {"low": low_summary, "mixed": mixed_summary, "strong": strong_summary}
    expected = {"low": (24, 6, 18, 2), "mixed": (33, 29, 0, 9), "strong": (33, 33, 0, 11)}
    for name, summary in result.items():
        skills = summary["skills"]
        assert set(skills) == set(low_summary["skills"]) and len(skills) == 11
        assert sum(x["total"] for x in skills.values()) == summary["answers"]
        assert sum(x["correct"] for x in skills.values()) == summary["correct"]
        # Descriptive grouping only: every shown skill here has 3/3,
        # and every follow-up has at least two incorrect/skipped answers.
        summary["shown"] = sum(x == {"correct": 3, "total": 3} for x in skills.values())
        summary["followUp"] = sum(x["total"] - x["correct"] >= 2 for x in skills.values())
        assert summary["shown"] + summary["followUp"] == 11
        summary["wrong"] = summary["answers"] - summary["correct"] - summary["skipped"]
        assert (summary["answers"], summary["correct"], summary["skipped"], summary["shown"]) == expected[name]
    failed = read("pupil-low-failed-sample.json")
    assert len(failed["questions"]) == 25
    result["limitations"] = [
        "Simulations in one domain; no estimate of human understanding or false-positive rate.",
        "Low rerun followed post-completion answer review of the failed first attempt.",
        "Mixed evidence is rendered UI only; storage metadata was not exported.",
    ]
    (ROOT / "pupil-levels-summary.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Recorded tests consistent: low 2/11, mixed 9/11, strong 11/11 shown; all 11 tested.")


if __name__ == "__main__":
    main()
