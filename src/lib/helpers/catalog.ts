import type { Block, CategoryMeta, Field, FormValues, HelperDef, TableCol } from "./types";

export const CATEGORIES: CategoryMeta[] = [
  { id: "money", label: "Money & adulting", kicker: "January-proof", range: "01–06" },
  { id: "freelance", label: "Freelance & solopreneur", kicker: "Stop the 11pm scramble", range: "07–13" },
  { id: "profession", label: "Niche profession OS", kicker: "Specificity is the price", range: "14–22" },
  { id: "health", label: "Health, food, body", kicker: "Bought at 11pm", range: "23–28" },
  { id: "home", label: "Home, family, parenting", kicker: "The household runbook", range: "29–35" },
  { id: "creators", label: "Creators & marketers", kicker: "Ship on a calendar", range: "36–42" },
  { id: "career", label: "Career, school, job hunt", kicker: "Deadline buyers", range: "43–47" },
  { id: "ai", label: "AI & sell-the-thing tools", kicker: "Job-specific, not generic", range: "48–50" },
];

const text = (id: string, label: string, extra: Partial<Field> = {}): Field => ({ id, type: "text", label, ...extra });
const area = (id: string, label: string, extra: Partial<Field> = {}): Field => ({
  id, type: "textarea", label, rows: extra.rows ?? 3, span: 2, ...extra,
});
const money = (id: string, label: string, extra: Partial<Field> = {}): Field => ({ id, type: "currency", label, ...extra });
const num = (id: string, label: string, extra: Partial<Field> = {}): Field => ({ id, type: "number", label, ...extra });
const date = (id: string, label: string, extra: Partial<Field> = {}): Field => ({ id, type: "date", label, ...extra });
const month = (id: string, label: string, extra: Partial<Field> = {}): Field => ({ id, type: "month", label, ...extra });
const sel = (id: string, label: string, options: string[], extra: Partial<Field> = {}): Field => ({
  id, type: "select", label, options, ...extra,
});
const mail = (id: string, label: string, extra: Partial<Field> = {}): Field => ({ id, type: "email", label, ...extra });
const tel = (id: string, label: string, extra: Partial<Field> = {}): Field => ({ id, type: "tel", label, ...extra });

const col = (id: string, label: string, type: TableCol["type"] = "text"): TableCol => ({ id, label, type });

function checks(id: string, title: string, labels: string[]): Block {
  return { kind: "checks", id, title, items: labels.map((label, i) => ({ id: `${id}_${i + 1}`, label })) };
}

function H(
  n: number,
  id: string,
  category: string,
  title: string,
  blurb: string,
  blocks: Block[],
  sample: FormValues = {},
  identity: Field[] = [text("preparedBy", "Prepared by"), date("preparedOn", "Date")],
): HelperDef {
  return { id, n, title, blurb, category, identity, blocks, sample };
}

export const HELPERS: HelperDef[] = [
  H(1, "sinking-funds-bill-calendar", "money", "Sinking-funds + bill calendar",
    "Stop the Sunday scramble. Name the bills, the months they hit, and what to set aside this payday.",
    [
      { kind: "fields", title: "This payday", fields: [month("forMonth", "Month"), money("takeHome", "Take-home this period"), date("payday", "Payday")] },
      { kind: "table", id: "funds", title: "Sinking funds", minRows: 6, sum: "perMonth",
        columns: [col("name", "Fund"), col("due", "Hits", "month"), col("needed", "Need by then", "currency"), col("perMonth", "Set aside", "currency"), col("notes", "Notes")] },
      { kind: "note", body: "This month’s set-aside is the sum of the Set aside column. Pay that first. Then groceries." },
    ],
    { forMonth: "2026-01", takeHome: "4200", payday: "2026-01-15",
      funds: [
        { name: "Car insurance", due: "2026-03", needed: "360", perMonth: "120", notes: "" },
        { name: "Christmas", due: "2026-12", needed: "900", perMonth: "75", notes: "" },
        { name: "Vet / pets", due: "2026-06", needed: "240", perMonth: "40", notes: "" },
      ] }),

  H(2, "irregular-income-allocator", "money", "Irregular-income allocator",
    "You got paid. Before the money feels like a bonus, split it into floor, tax, buffer, and fun.",
    [
      { kind: "fields", title: "This check", fields: [money("gross", "Gross"), money("net", "Net deposited"), date("received", "Received"), text("source", "Source")] },
      { kind: "table", id: "buckets", title: "Buckets", minRows: 5, sum: "amount",
        columns: [col("bucket", "Bucket"), col("pct", "%", "percent"), col("amount", "Amount", "currency"), col("account", "Goes to")] },
      { kind: "prompts", title: "Before you spend the leftover", items: ["Is the tax bucket at 25%+ of net?", "Is next month’s floor already funded?", "What would make this check feel wasted in 30 days?"] },
    ],
    { gross: "3800", net: "3100", source: "Invoice #441",
      buckets: [
        { bucket: "Tax", pct: "25", amount: "775", account: "HYSA-tax" },
        { bucket: "Floor (rent + food)", pct: "40", amount: "1240", account: "Checking" },
        { bucket: "Buffer", pct: "20", amount: "620", account: "HYSA-ops" },
        { bucket: "Owner pay", pct: "15", amount: "465", account: "Personal" },
      ] }),

  H(3, "subscription-leak-audit", "money", "Subscription leak audit",
    "Every silent $7.99. Keep, pause, or kill — with a date you’ll actually check.",
    [
      { kind: "table", id: "subs", title: "Charges on the card", minRows: 8, sum: "price",
        columns: [col("name", "Name"), col("price", "Price", "currency"), col("cadence", "Cadence"), col("lastUsed", "Last used"), col("verdict", "Keep / pause / kill"), col("notes", "Notes")] },
      { kind: "fields", fields: [date("nextReview", "Next review date"), area("rule", "Rule for new subscriptions")] },
    ],
    { nextReview: "2026-04-01",
      subs: [
        { name: "Streaming bundle", price: "24", cadence: "mo", lastUsed: "yesterday", verdict: "keep", notes: "" },
        { name: "Cloud storage extra", price: "10", cadence: "mo", lastUsed: "unknown", verdict: "kill", notes: "Photos already on NAS" },
      ] }),

  H(4, "can-we-afford-this", "money", "Can we afford this?",
    "A one-page yes/no for the couch, the trip, the used car — before the cart is full.",
    [
      { kind: "fields", title: "The thing", fields: [text("item", "What"), money("sticker", "Sticker price"), money("trueCost", "True cost (tax, delivery, upkeep)"), sel("urgency", "Urgency", ["Want", "Soon", "Need this month"])] },
      { kind: "fields", title: "The money", fields: [money("cash", "Cash on hand"), money("bufferAfter", "Buffer left after"), money("hoursToEarn", "Hours of work this is")] },
      { kind: "prompts", title: "Decide out loud", items: ["If this broke tomorrow, would we still buy it?", "What do we not buy if we buy this?", "Sleep on it until:"] },
      { kind: "fields", fields: [sel("verdict", "Verdict", ["Wait", "Buy used", "Buy now", "No"]), area("why", "Why")] },
    ],
    { item: "Used Honda Fit", sticker: "6500", trueCost: "7800", urgency: "Soon", cash: "9200", bufferAfter: "1400", hoursToEarn: "120", verdict: "Wait" }),

  H(5, "tax-folder-quarterly", "money", "Tax-folder + quarterly estimate",
    "A shoebox with a spine. What you owe, what you already paid, what to send this quarter.",
    [
      { kind: "fields", title: "Year", fields: [text("taxYear", "Tax year"), text("entity", "You / LLC / both"), money("ytdProfit", "YTD profit"), money("alreadyPaid", "Estimates already paid")] },
      { kind: "table", id: "quarters", title: "Estimates", minRows: 4,
        columns: [col("q", "Quarter"), col("due", "Due", "date"), col("amount", "Send", "currency"), col("paid", "Paid?", "text"), col("conf", "Confirmation")] },
      checks("docs", "Folder contents", ["1099s downloaded", "Mileage log", "Home office sq ft", "Prior-year return", "Charitable receipts"]),
    ],
    { taxYear: "2026", entity: "Schedule C", ytdProfit: "41000", alreadyPaid: "3200" }),

  H(6, "payday-one-big-bill", "money", "Payday: one big bill plan",
    "This paycheck has one ugly bill. Name it, fund it, and protect the rest.",
    [
      { kind: "fields", fields: [text("bill", "The bill"), money("amount", "Amount due"), date("due", "Due"), money("paycheck", "This paycheck")] },
      { kind: "fields", fields: [money("afterBill", "Left after the bill"), money("groceries", "Groceries until next pay"), money("gas", "Gas / commute"), money("fun", "Allowed fun")] },
      { kind: "prompts", title: "If it still doesn’t fit", items: ["Call and split the bill?", "Move a sinking fund by one payday?", "What gets paused for 14 days?"] },
    ],
    { bill: "Car repair", amount: "890", due: "2026-01-20", paycheck: "2100", afterBill: "1210", groceries: "180", gas: "80", fun: "40" }),

  H(7, "invoice-chase-tracker", "freelance", "Invoice chase tracker",
    "Who owes you, since when, what you already said, and the next sentence you’ll send.",
    [
      { kind: "table", id: "invoices", title: "Open invoices", minRows: 6, sum: "amount",
        columns: [col("client", "Client"), col("num", "#"), col("amount", "Amount", "currency"), col("sent", "Sent", "date"), col("status", "Status"), col("next", "Next action")] },
      { kind: "fields", title: "The email you’ll send today", fields: [text("to", "To"), area("script", "Script (plain, short)")] },
    ],
    { invoices: [{ client: "Northside PT", num: "441", amount: "1800", sent: "2025-12-02", status: "14 days", next: "Call Tuesday 10am" }] }),

  H(8, "scope-creep-change-order", "freelance", "Scope-creep change order",
    "They asked for ‘just one more thing.’ This is the paper that makes it a paid thing.",
    [
      { kind: "fields", title: "Original", fields: [text("client", "Client"), text("project", "Project"), date("signed", "Original signed"), money("originalFee", "Original fee")] },
      { kind: "fields", title: "The extra", fields: [area("asked", "What they asked"), area("impact", "What it does to timeline / scope"), money("fee", "Additional fee"), date("newDate", "New delivery")] },
      { kind: "fields", fields: [sel("status", "Status", ["Draft", "Sent", "Signed", "Declined"]), area("terms", "If they say no")] },
    ],
    { client: "Harbor Kids Co.", project: "Brand kit", originalFee: "2400", asked: "Also the shop banners and three email headers", fee: "650", status: "Draft" }),

  H(9, "project-kickoff-one-pager", "freelance", "Project kickoff one-pager",
    "One sheet you send before kickoff so ‘I thought you meant…’ dies early.",
    [
      { kind: "fields", fields: [text("client", "Client"), text("project", "Project"), date("start", "Start"), date("done", "Done-done date")] },
      { kind: "fields", fields: [area("in", "In scope"), area("out", "Out of scope"), area("needFromThem", "I need from you"), text("channel", "Where we talk")] },
      { kind: "fields", fields: [money("fee", "Fee"), text("paySchedule", "Pay schedule"), text("revision", "Revisions included")] },
    ],
    { client: "St. Luke’s PTA", project: "Spring auction site", fee: "1200", revision: "2 rounds", channel: "Email + one weekly call" }),

  H(10, "rate-raise-script", "freelance", "Rate-raise conversation sheet",
    "The talk you’ve been postponing. Numbers, script, and who you tell first.",
    [
      { kind: "fields", title: "The math", fields: [money("oldRate", "Current rate"), money("newRate", "New rate"), text("effective", "Effective date"), sel("who", "Who first", ["New leads only", "Quiet clients", "Everyone", "One flagship"])] },
      { kind: "prompts", title: "Write it once", items: ["One sentence why (cost of living is not the sentence).", "What they still get.", "What happens if they can’t." ] },
      { kind: "fields", fields: [area("script", "The email / call script"), area("objections", "Likely objection → your line")] },
    ],
    { oldRate: "85", newRate: "110", effective: "March 1", who: "New leads only" }),

  H(11, "client-onboarding-checklist", "freelance", "Client onboarding checklist",
    "The first 10 days, written down, so you stop reinventing the welcome every time.",
    [
      checks("before", "Before kickoff", ["Contract signed", "Deposit landed", "Intake form back", "Assets folder shared", "Calendar hold"]),
      checks("week1", "Week one", ["Kickoff call", "Access (brand, analytics, CMS)", "Success metric agreed", "First deliverable dated"]),
      { kind: "fields", fields: [text("client", "Client"), date("kickoff", "Kickoff"), text("folder", "Folder URL"), area("notes", "Oddities")] },
    ],
    { client: "River & Pine", kickoff: "2026-01-12" }),

  H(12, "proposal-in-a-box", "freelance", "11pm proposal in a box",
    "They want a proposal tonight. Fill this, paste it, go to bed.",
    [
      { kind: "fields", fields: [text("client", "Client"), text("problem", "The problem in their words"), text("outcome", "The outcome they’ll see")] },
      { kind: "table", id: "options", title: "Three options", minRows: 3,
        columns: [col("name", "Option"), col("includes", "Includes"), col("timeline", "Timeline"), col("price", "Price", "currency")] },
      { kind: "fields", fields: [text("valid", "Valid until"), area("next", "How they say yes")] },
    ],
    { client: "Oak & Iron", problem: "Homepage doesn’t convert the consult", outcome: "A page that books 8 consults/mo",
      options: [
        { name: "Fix", includes: "Hero + offer + proof", timeline: "10 days", price: "1800" },
        { name: "Rebuild", includes: "Full page + 3 emails", timeline: "3 weeks", price: "4200" },
      ] }),

  H(13, "keep-kill-client-review", "freelance", "Keep / kill client review",
    "Once a quarter: who drains you, who pays, who gets a raise or a goodbye.",
    [
      { kind: "table", id: "clients", title: "Roster", minRows: 6,
        columns: [col("name", "Client"), col("rev", "90-day rev", "currency"), col("energy", "Energy 1–5", "number"), col("pay", "Pays on time?"), col("verdict", "Keep / raise / kill"), col("notes", "Notes")] },
      { kind: "prompts", title: "The rule", items: ["Kill anyone who is late AND low-energy.", "Raise anyone who is easy AND under market.", "Keep a loss-leader only if it feeds a better client."] },
    ],
    { clients: [{ name: "Northside PT", rev: "5400", energy: "4", pay: "yes", verdict: "keep", notes: "" }] }),

  H(14, "teacher-sub-plan-packet", "profession", "Teacher sub-plan packet",
    "If you are out tomorrow, the sub can run the day without texting you at 7:40am.",
    [
      { kind: "fields", fields: [text("teacher", "Teacher"), text("room", "Room"), date("day", "Date out"), text("grade", "Grade / subject")] },
      { kind: "fields", fields: [area("schedule", "Bell schedule"), area("rosterNotes", "Kids / medical / seating"), area("lessons", "Lessons, minute by minute"), area("emergency", "Who to call in the building")] },
      checks("kit", "The folder", ["Roster", "Seating chart", "Passwords sheet (locked)", "Dismissal list", "Nurse notes"]),
    ],
    { teacher: "M. Ellis", room: "214", grade: "7th ELA", day: "2026-01-22" }),

  H(15, "realtor-showing-day", "profession", "Realtor showing-day runbook",
    "Addresses, lockboxes, buyer notes, and the 4pm debrief — on one sheet.",
    [
      { kind: "fields", fields: [text("buyer", "Buyer / renter"), date("day", "Day"), text("budget", "Budget"), text("must", "Must-haves")] },
      { kind: "table", id: "stops", title: "Stops", minRows: 6,
        columns: [col("time", "Time"), col("address", "Address"), col("code", "Access"), col("notes", "Notes"), col("reaction", "Reaction")] },
      { kind: "fields", fields: [area("debrief", "End-of-day debrief"), text("next", "Next showing / offer")] },
    ],
    { buyer: "Chen family", day: "2026-01-18", budget: "410k", must: "1-story, fenced yard" }),

  H(16, "trades-job-cost-sheet", "profession", "Trades job-cost sheet",
    "Materials, hours, dump fees, and whether this job actually paid.",
    [
      { kind: "fields", fields: [text("job", "Job / address"), text("client", "Client"), date("start", "Start"), money("quoted", "Quoted")] },
      { kind: "table", id: "costs", title: "Costs", minRows: 6, sum: "amount",
        columns: [col("item", "Item"), col("vendor", "Vendor"), col("amount", "Amount", "currency"), col("billable", "Billable?")] },
      { kind: "fields", fields: [num("hours", "Hours"), money("laborRate", "Your hour rate"), money("profit", "Profit after costs")] },
    ],
    { job: "14 Maple — bath fan", quoted: "850", hours: "6", laborRate: "75" }),

  H(17, "booth-renter-week", "profession", "Salon / booth-renter week",
    "Chair rent, product, tips, and whether the week was worth the booth.",
    [
      { kind: "fields", fields: [text("name", "Name"), month("weekOf", "Week of"), money("rent", "Booth rent this week")] },
      { kind: "table", id: "days", title: "Days", minRows: 6, sum: "take",
        columns: [col("day", "Day"), col("heads", "Heads", "number"), col("take", "Take", "currency"), col("tips", "Tips", "currency"), col("product", "Product used", "currency")] },
      { kind: "fields", fields: [money("net", "Net after rent + product"), area("notes", "Slow days / next week holds")] },
    ],
    { name: "A. Ruiz", rent: "250" }),

  H(18, "shift-handoff", "profession", "Shift handoff sheet",
    "What the next person needs in 90 seconds: open loops, watch-outs, who to call.",
    [
      { kind: "fields", fields: [text("unit", "Unit / desk"), date("shift", "Shift date"), text("from", "From"), text("to", "To")] },
      { kind: "table", id: "loops", title: "Open loops", minRows: 6,
        columns: [col("who", "Who / what"), col("status", "Status"), col("need", "Need from next shift"), col("by", "By when")] },
      { kind: "fields", fields: [area("watch", "Watch-outs"), area("done", "Already handled — do not redo")] },
    ],
    { unit: "Pharmacy nights", from: "Darren", to: "Days" }),

  H(19, "care-visit-log", "profession", "Care-visit log",
    "Pastor, chaplain, home-health, neighbor: who you saw, what they asked, the follow-up.",
    [
      { kind: "fields", fields: [text("person", "Person"), date("when", "When"), text("where", "Where"), text("reason", "Reason for visit")] },
      { kind: "fields", fields: [area("heard", "What they said (their words)"), area("need", "Practical need"), area("follow", "Follow-up I own"), date("next", "Next touch")] },
      checks("care", "Quiet checklist", ["Prayed / sat still", "Did not over-promise", "Noted in the private log", "Referred if over my lane"]),
    ],
    { person: "J. Hale", where: "Home", reason: "Post-surgery" }),

  H(20, "shoot-day-runsheet", "profession", "Photographer shoot-day runsheet",
    "Call time, shot list, backup cards, and the client’s non-negotiables.",
    [
      { kind: "fields", fields: [text("client", "Client"), date("day", "Day"), text("location", "Location"), text("callTime", "Call time")] },
      { kind: "table", id: "shots", title: "Must-get shots", minRows: 8,
        columns: [col("shot", "Shot"), col("who", "Who"), col("window", "Window"), col("got", "Got?")] },
      checks("kit", "Kit", ["Cards formatted", "Batteries ×2", "Backup body", "Release signed", "Timeline printed"]),
    ],
    { client: "Maya + Ben", location: "Riverside pavilion", callTime: "2:30pm" }),

  H(21, "tutor-session-tracker", "profession", "Tutor session tracker",
    "What you covered, what they missed, the 10-minute homework, the parent note.",
    [
      { kind: "fields", fields: [text("student", "Student"), date("session", "Session"), text("subject", "Subject"), num("mins", "Minutes")] },
      { kind: "fields", fields: [area("covered", "Covered"), area("stuck", "Still stuck"), area("hw", "Homework (tiny)"), area("parent", "Note to parent")] },
    ],
    { student: "Eli M.", subject: "Algebra 1", mins: "60" }),

  H(22, "unit-turn-checklist", "profession", "Landlord unit-turn checklist",
    "Move-out to list-ready: deposits, paint, keys, and the photos you’ll actually take.",
    [
      { kind: "fields", fields: [text("unit", "Unit"), date("moveOut", "Move-out"), date("listBy", "List by"), money("deposit", "Deposit held")] },
      checks("turn", "Turn", ["Walkthrough video", "Walls", "Appliances", "HVAC filter", "Keys + fobs", "Smoke / CO", "Photos in daylight", "Listing draft"]),
      { kind: "table", id: "repairs", title: "Repairs", minRows: 5, sum: "cost",
        columns: [col("item", "Item"), col("who", "Who"), col("cost", "Cost", "currency"), col("done", "Done")] },
    ],
    { unit: "B-2 Boonsboro", deposit: "1200", moveOut: "2026-01-31" }),

  H(23, "appointment-questions", "health", "Appointment questions sheet",
    "You will forget the questions in the room. Write them now. Take this paper in.",
    [
      { kind: "fields", fields: [text("who", "Clinician / clinic"), date("when", "When"), text("why", "Why you’re there")] },
      { kind: "table", id: "qs", title: "Questions (in order)", minRows: 6,
        columns: [col("q", "Question"), col("answer", "What they said"), col("next", "Next step")] },
      { kind: "fields", fields: [area("meds", "Meds / supplements they should know"), area("after", "After-visit: what I will actually do")] },
    ],
    { who: "Endocrine", why: "Labs + fatigue" }),

  H(24, "symptom-meds-log", "health", "Symptom + meds log",
    "Seven days. Time, what you took, what you felt. Bring it, don’t reconstruct it.",
    [
      { kind: "fields", fields: [text("person", "Name"), month("week", "Week of"), text("focus", "Tracking")] },
      { kind: "table", id: "days", title: "Days", minRows: 7,
        columns: [col("day", "Day"), col("sleep", "Sleep hrs", "number"), col("pain", "Pain 0–10", "number"), col("meds", "Meds / food notes"), col("energy", "Energy 0–10", "number")] },
      { kind: "fields", fields: [area("pattern", "Pattern I notice")] },
    ],
    { person: "Self", focus: "Sleep vs afternoon crash" }),

  H(25, "grocery-protocol-list", "health", "Grocery-for-the-protocol list",
    "Not a meal plan. The actual cart for the way you eat this week.",
    [
      { kind: "fields", fields: [text("protocol", "Way of eating"), month("week", "Week"), money("budget", "Budget")] },
      { kind: "table", id: "list", title: "Cart", minRows: 12,
        columns: [col("item", "Item"), col("aisle", "Need from"), col("have", "Have?"), col("notes", "Notes")] },
      { kind: "fields", fields: [area("doNotBuy", "Do not buy (the 11pm stuff)")] },
    ],
    { protocol: "GAPS / nutrient-dense", budget: "160" }),

  H(26, "sleep-pain-week", "health", "Sleep / pain week",
    "Bedtime, wake, pain, caffeine, screens — so you’re not guessing on Friday.",
    [
      { kind: "table", id: "nights", title: "Nights", minRows: 7,
        columns: [col("night", "Night"), col("bed", "Bed"), col("wake", "Wake"), col("hrs", "Hours", "number"), col("pain", "Pain"), col("notes", "Notes")] },
      { kind: "fields", fields: [area("rule", "One rule I’ll keep 7 nights"), area("drop", "One thing I’ll drop after 8pm")] },
    ]),

  H(27, "specialist-history-one-pager", "health", "Specialist history one-pager",
    "Hand this over instead of reconstructing 11 years in the waiting room.",
    [
      { kind: "fields", fields: [text("name", "Name"), date("dob", "DOB"), text("specialist", "Seeing")] },
      { kind: "fields", fields: [area("timeline", "Timeline (year → event)"), area("meds", "Current meds / doses"), area("allergies", "Allergies"), area("goal", "What I want from today")] },
    ],
    { specialist: "GI", goal: "Decide if we stay the course or change" }),

  H(28, "hard-week-meal-prep", "health", "Meal-prep for a hard week",
    "Night-shift week, sick kid, travel: five boring meals that will actually get eaten.",
    [
      { kind: "fields", fields: [text("week", "The week"), text("constraint", "Constraint"), num("mouths", "Mouths", { label: "People" })] },
      { kind: "table", id: "meals", title: "Meals", minRows: 5,
        columns: [col("slot", "Slot"), col("meal", "Meal"), col("prep", "Prep when"), col("reheat", "Reheat")] },
      { kind: "fields", fields: [area("shop", "Shop once"), area("no", "Out of bounds this week")] },
    ],
    { week: "7-on nights", constraint: "No 8pm cooking", mouths: "2" }),

  H(29, "household-runbook", "home", "Household runbook",
    "If you got hit by a bus (or a double shift): bills, logins location, who to call.",
    [
      { kind: "fields", fields: [text("home", "Home"), text("owner", "Primary"), tel("emergency", "Emergency contact")] },
      { kind: "table", id: "bills", title: "Bills & logins live where", minRows: 8,
        columns: [col("what", "What"), col("where", "Where it lives"), col("who", "Who can do it"), col("cycle", "Cycle")] },
      { kind: "fields", fields: [area("kids", "Kids / pets / medical"), area("house", "House (water, breaker, trash)")] },
    ],
    { home: "Boonsboro", owner: "Darren" }),

  H(30, "babysitter-one-pager", "home", "Babysitter one-pager",
    "Bedtimes, allergies, neighbor, and the number that is actually you.",
    [
      { kind: "fields", fields: [text("kids", "Kids + ages"), date("night", "Night"), text("bed", "Bedtime"), tel("you", "Call us at")] },
      { kind: "fields", fields: [area("food", "Food / allergies"), area("routine", "Routine"), area("no", "Do not"), tel("neighbor", "Neighbor / backup")] },
      checks("leave", "Before you leave", ["Meds explained", "Wifi written down", "Door code", "Snack they can have"]),
    ]),

  H(31, "school-forms-tracker", "home", "School forms tracker",
    "The packet on the counter. What’s due, what’s signed, what still needs a check.",
    [
      { kind: "fields", fields: [text("kid", "Student"), text("school", "School"), month("term", "Term")] },
      { kind: "table", id: "forms", title: "Forms", minRows: 8,
        columns: [col("form", "Form"), col("due", "Due", "date"), col("status", "Status"), col("who", "Who signs"), col("notes", "Notes")] },
    ],
    { kid: "Luke", school: "Liberty University", term: "2026-09" }),

  H(32, "chore-allowance", "home", "Chore + allowance sheet",
    "What ‘done’ means, what it pays, and payday — without a lecture.",
    [
      { kind: "fields", fields: [text("kid", "Kid"), money("rate", "Weekly if all done"), date("payday", "Payday")] },
      { kind: "table", id: "chores", title: "Chores", minRows: 8,
        columns: [col("chore", "Chore"), col("doneLooks", "Done looks like"), col("day", "Day"), col("did", "Did it?")] },
      { kind: "fields", fields: [area("bonus", "Bonus jobs"), money("paid", "Paid this week")] },
    ]),

  H(33, "family-calendar-loadout", "home", "Family calendar loadout",
    "The week on one page: who is where, meals that match, and the one thing that cannot slip.",
    [
      { kind: "fields", fields: [month("week", "Week of"), text("anchor", "The one immovable")] },
      { kind: "table", id: "days", title: "Days", minRows: 7,
        columns: [col("day", "Day"), col("am", "Morning"), col("pm", "Afternoon / night"), col("meal", "Dinner"), col("who", "Who’s out")] },
      { kind: "fields", fields: [area("rides", "Rides / coverage gaps")] },
    ]),

  H(34, "emergency-contacts-kit", "home", "Emergency contacts kit",
    "Fridge-door version: medical, neighbors, insurance, the vet, the church.",
    [
      { kind: "table", id: "people", title: "People", minRows: 8,
        columns: [col("role", "Role"), col("name", "Name"), col("phone", "Phone", "tel"), col("notes", "Notes")] },
      { kind: "fields", fields: [text("address", "Home address"), text("insurance", "Insurance / member ID"), text("vet", "Vet"), area("meds", "Household meds / allergies")] },
    ]),

  H(35, "moving-week-checklist", "home", "Moving-week checklist",
    "Seven days out to the first night: utilities, boxes, and the bag you keep with you.",
    [
      { kind: "fields", fields: [date("move", "Move day"), text("from", "From"), text("to", "To")] },
      checks("week", "This week", ["USPS forward", "Utilities stop/start", "Change address bank", "School / work", "Fridge emptied", "Essentials bag", "First-night beds"]),
      { kind: "fields", fields: [area("bag", "Ride-with-you bag"), area("vendors", "Movers / friends")] },
    ]),

  H(36, "content-calendar-ship", "creators", "Content calendar that ships",
    "Four weeks. One promise per slot. If it isn’t on this page, it isn’t this month.",
    [
      { kind: "fields", fields: [month("month", "Month"), text("promise", "This month’s promise"), text("channel", "Main channel")] },
      { kind: "table", id: "slots", title: "Slots", minRows: 8,
        columns: [col("when", "When"), col("piece", "Piece"), col("status", "Status"), col("cta", "CTA")] },
      { kind: "fields", fields: [area("batch", "Batch day plan")] },
    ],
    { month: "2026-02", promise: "One helpful post a week, no more", channel: "X" }),

  H(37, "batch-filming-shotlist", "creators", "Batch-filming shot list",
    "One afternoon, six pieces. Shots, B-roll, and the line you always forget.",
    [
      { kind: "fields", fields: [date("day", "Filming day"), text("setup", "Setup"), num("pieces", "Pieces to leave with")] },
      { kind: "table", id: "shots", title: "Shots", minRows: 8,
        columns: [col("piece", "Piece"), col("hook", "Hook line"), col("broll", "B-roll"), col("got", "Got?")] },
      checks("day", "Day-of", ["Cards empty", "Mic check", "Thumbnails stills", "Voice rest after"]),
    ]),

  H(38, "sponsorship-rate-card", "creators", "Sponsorship rate card",
    "What you charge, what’s included, and the kill fee — before they ask for ‘exposure.’",
    [
      { kind: "fields", fields: [text("property", "Property"), text("audience", "Audience in one line"), mail("contact", "Contact")] },
      { kind: "table", id: "offers", title: "Offers", minRows: 4,
        columns: [col("offer", "Offer"), col("includes", "Includes"), col("price", "Price", "currency"), col("lead", "Lead time")] },
      { kind: "fields", fields: [area("no", "I don’t do"), area("terms", "Kill fee / exclusivity")] },
    ],
    { property: "Pain Point Helpers / Maybee Creations", audience: "Parents + solopreneurs who buy tools" }),

  H(39, "launch-week-runbook", "creators", "Launch-week runbook",
    "T-minus seven to the thank-you email. One owner per task.",
    [
      { kind: "fields", fields: [text("offer", "Offer"), date("open", "Opens"), date("close", "Closes"), money("goal", "Revenue goal")] },
      { kind: "table", id: "tasks", title: "Tasks", minRows: 8,
        columns: [col("when", "When"), col("task", "Task"), col("owner", "Owner"), col("done", "Done")] },
      { kind: "fields", fields: [area("assets", "Must-exist assets"), area("risks", "If it flops at 48 hours")] },
    ]),

  H(40, "email-sequence-outline", "creators", "Email sequence outline",
    "Five emails, one job each. Subject, point, link. Not a novel.",
    [
      { kind: "fields", fields: [text("offer", "Offer"), text("list", "List / segment"), date("start", "Starts")] },
      { kind: "table", id: "emails", title: "Emails", minRows: 5,
        columns: [col("n", "#"), col("when", "When"), col("subject", "Subject"), col("job", "Job of this email"), col("cta", "CTA")] },
    ]),

  H(41, "offer-stack-worksheet", "creators", "Offer-stack worksheet",
    "Core offer, bonuses that are actually used, price, guarantee, and the ‘not for’.",
    [
      { kind: "fields", fields: [text("name", "Offer name"), money("price", "Price"), text("promise", "Promise in one sentence")] },
      { kind: "table", id: "stack", title: "Stack", minRows: 5,
        columns: [col("piece", "Piece"), col("why", "Why it belongs"), col("solo", "Solo value", "currency")] },
      { kind: "fields", fields: [area("notFor", "Not for"), area("guarantee", "Guarantee")] },
    ],
    { name: "All-access Pain Point Helpers", price: "99", promise: "Stop reinventing the spreadsheet every Sunday" }),

  H(42, "audience-research-notes", "creators", "Audience research notes",
    "Ten real comments/emails. The words they use. The product that deletes that sentence.",
    [
      { kind: "table", id: "quotes", title: "Their words", minRows: 8,
        columns: [col("who", "Who / where"), col("said", "What they said"), col("pain", "Pain"), col("product", "Product that deletes it")] },
      { kind: "fields", fields: [area("pattern", "The pattern"), area("next", "The next thing I’ll ship")] },
    ]),

  H(43, "interview-story-bank", "career", "Interview story bank",
    "STAR stories you can actually say out loud. Situation, you, result, number.",
    [
      { kind: "table", id: "stories", title: "Stories", minRows: 6,
        columns: [col("prompt", "They ask"), col("sit", "Situation"), col("you", "What you did"), col("result", "Result / number")] },
      { kind: "fields", fields: [area("closer", "The 20-second closer"), text("role", "Role I’m chasing")] },
    ],
    { role: "Clinical pharmacist / nights" }),

  H(44, "job-hunt-tracker", "career", "Job-hunt tracker",
    "One pipeline. No twelve tabs. Applied, heard, interview, offer, no.",
    [
      { kind: "table", id: "jobs", title: "Pipeline", minRows: 8,
        columns: [col("co", "Company"), col("role", "Role"), col("stage", "Stage"), col("date", "Last touch", "date"), col("next", "Next")] },
      { kind: "fields", fields: [num("target", "Apps this week"), area("rule", "Stop-doing list (job boards at 1am)")] },
    ]),

  H(45, "salary-negotiation-sheet", "career", "Salary negotiation sheet",
    "Range, walk-away, non-cash, and the sentence you’ll use when they go first.",
    [
      { kind: "fields", fields: [text("role", "Role"), money("floor", "Walk-away"), money("target", "Target"), money("stretch", "Stretch")] },
      { kind: "fields", fields: [area("comp", "Other comp I care about"), area("proof", "Proof I can point at"), area("script", "If they ask my number first")] },
    ],
    { floor: "72000", target: "82000", stretch: "90000" }),

  H(46, "thirty-sixty-ninety", "career", "30-60-90 plan",
    "The first three months in a new seat — so you look like you meant to be there.",
    [
      { kind: "fields", fields: [text("role", "Role"), date("start", "Start"), text("manager", "Manager")] },
      { kind: "fields", fields: [area("d30", "Days 1–30 (learn / map)"), area("d60", "Days 31–60 (own a slice)"), area("d90", "Days 61–90 (show a result)")] },
      { kind: "fields", fields: [area("metrics", "How we’ll know it worked")] },
    ]),

  H(47, "brag-sheet-rec-letter", "career", "Brag sheet for a rec letter",
    "Give them the stories, numbers, and dates so the letter isn’t ‘hard-working team player.’",
    [
      { kind: "fields", fields: [text("you", "You"), text("writer", "Writer"), text("for", "For what")] },
      { kind: "table", id: "wins", title: "Wins they can cite", minRows: 5,
        columns: [col("when", "When"), col("win", "What happened"), col("number", "Number"), col("theirRole", "How they saw it")] },
      { kind: "fields", fields: [area("draft", "Sentences they can steal"), date("needBy", "Need the letter by")] },
    ]),

  H(48, "job-prompt-library", "ai", "Prompt library for the actual job",
    "Not ‘write a blog post.’ The five prompts you will run this week, with inputs and a done-looks-like.",
    [
      { kind: "fields", fields: [text("job", "The job"), text("tool", "Tool")] },
      { kind: "table", id: "prompts", title: "Prompts", minRows: 5,
        columns: [col("name", "Name"), col("when", "When I run it"), col("input", "I paste"), col("done", "Done looks like")] },
      { kind: "fields", fields: [area("never", "Never let it do")] },
    ],
    { job: "Hospital pharmacy nights", tool: "Grok" }),

  H(49, "sop-from-messy-process", "ai", "SOP from a messy process",
    "You do this from memory. Write the steps once. Hand it to a human or a model next time.",
    [
      { kind: "fields", fields: [text("process", "Process name"), text("owner", "Owner"), text("trigger", "When it starts")] },
      { kind: "table", id: "steps", title: "Steps", minRows: 8,
        columns: [col("n", "#"), col("step", "Step"), col("tool", "Tool / place"), col("pitfall", "Pitfall")] },
      { kind: "fields", fields: [area("done", "Definition of done"), area("exceptions", "Exceptions")] },
    ],
    { process: "Month-end invoice chase", owner: "Me", trigger: "The 1st" }),

  H(50, "client-deliverable-ai-checklist", "ai", "Client deliverable checklist (AI in the loop)",
    "What the model drafts, what you still touch, and what never ships without a human.",
    [
      { kind: "fields", fields: [text("deliverable", "Deliverable"), text("client", "Client"), date("due", "Due")] },
      { kind: "table", id: "pass", title: "Passes", minRows: 5,
        columns: [col("pass", "Pass"), col("who", "Human / model"), col("check", "Check"), col("done", "Done")] },
      checks("ship", "Ship gate", ["Numbers verified", "Names spelled", "Their words not ours", "PDF/print looks right", "You would sign it"]),
    ],
    { deliverable: "Q1 one-pager", client: "Internal" }),
];

export const HELPER_BY_ID: Record<string, HelperDef> = Object.fromEntries(HELPERS.map((h) => [h.id, h]));

export function categoryOf(id: string): CategoryMeta {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0]!;
}
