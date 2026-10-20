"""Frozen procedural models. Input: visible Swedish prompt only, never grading data.

This is a technical transfer experiment, not a new independent blind reviewer.
The mathematical abilities match the three prior models. The small parser is new.
Unknown phrasing is a parser error, distinct from a deliberate abstention.
"""
import re
from fractions import Fraction

MODEL_SPEC = {
    "low": "Single-event favourable/total only; abstain on conditional or two-draw tasks, including intermediate inventory.",
    "mixed": "Multiply initial bag fractions, sum both orders; never update bag without replacement. Count remaining from that unchanged bag.",
    "strong": "Update bag on no replacement, conditional fractions, multiply paths and sum both orders.",
}


def respond(level, prompt):
    match = re.search(r"En påse innehåller (\d+) röda och (\d+) blå kulor", prompt)
    if not match or level not in MODEL_SPEC:
        return {"kind": "parser-error", "reason": "Unsupported statement"}
    red, blue = map(int, match.groups())
    replacement = "med återläggning" in prompt
    without = "utan återläggning" in prompt
    conditional = "Den första kulan är röd" in prompt
    either = "en röd och en blå, i valfri ordning" in prompt
    if replacement == without or not (conditional or either):
        return {"kind": "parser-error", "reason": "Unsupported draw wording"}
    if level == "low":
        return {"kind": "abstain", "reason": "Outside frozen single-event routine; not a diagnosed misconception"}
    remove = int(without and level == "strong")
    total = red + blue
    if either:
        value = Fraction(red, total)*Fraction(blue, total-remove) + Fraction(blue,total)*Fraction(red,total-remove)
        method = "Sum red-blue and blue-red paths"
    elif "Hur många kulor finns i påsen inför andra draget" in prompt:
        value = Fraction(total-remove)
        method = "Inventory before second draw"
    elif "sannolikheten att den andra kulan är röd" in prompt:
        value = Fraction(red-remove,total-remove)
        method = "Red remaining / total remaining"
    elif "sannolikheten att den andra kulan är blå" in prompt:
        value = Fraction(blue,total-remove)
        method = "Blue remaining / total remaining"
    else:
        return {"kind": "parser-error", "reason": "Unsupported requested quantity"}
    return {"kind": "answer", "value": str(value), "method": method,
            "inventoryRule": "update" if level == "strong" else "unchanged"}
