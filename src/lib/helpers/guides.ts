import type { HelperDef } from "./types";

/** Maybee’s one-paragraph walkthrough for each kit. */
export const KIT_GUIDES: Record<string, string> = {
  "sinking-funds-bill-calendar":
    "This is the Sunday-night bill pile. Name each sinking fund, the month it hits, and what to set aside from this paycheck. The total at the bottom is what you move first — then groceries.",
  "irregular-income-allocator":
    "You got paid, and it feels like a bonus. Split the check into floor, tax, buffer, and fun before it disappears. If the leftover still looks huge, the tax bucket is probably too thin.",
  "subscription-leak-audit":
    "Every silent $7.99 lives here. List the charges, last time you used them, and keep / pause / kill. Pick a review date you’ll actually honor.",
  "can-we-afford-this":
    "A one-page yes/no before the cart is full. Sticker price is a liar — use true cost, hours of work, and what you will not buy if you buy this.",
  "tax-folder-quarterly":
    "A shoebox with a spine. What you owe, what you already sent, and the folder contents so April is not a treasure hunt.",
  "payday-one-big-bill":
    "This paycheck has one ugly bill. Name it, fund it, then protect groceries, gas, and a little fun. If it still doesn’t fit, the prompts are the next call — not another spreadsheet.",
  "invoice-chase-tracker":
    "Who owes you, since when, and the next sentence you’ll send. Fill the script once so you are not rewriting ‘just checking in’ at 11pm.",
  "scope-creep-change-order":
    "They asked for just one more thing. Write what they asked, what it does to the timeline, and the fee. This is the paper that makes it a paid thing.",
  "project-kickoff-one-pager":
    "Send this before kickoff so ‘I thought you meant…’ dies early. Scope, dates, and what is not included — on one sheet.",
  "rate-raise-script":
    "The talk you’ve been postponing. Numbers, who you tell first, and the email you’ll actually send. Cost of living is not the sentence.",
  "client-onboarding-checklist":
    "The first ten days, written down, so you stop reinventing the welcome. Check the boxes, send the links, move on.",
  "proposal-in-a-box":
    "They want a proposal tonight. Problem in their words, outcome they’ll see, price, and timeline. Fill it, paste it, go to bed.",
  "keep-kill-client-review":
    "Once a quarter: who drains you, who pays, who gets a raise or a goodbye. Be honest — a loss-leader only stays if it feeds a better client.",
  "teacher-sub-plan-packet":
    "If you are out tomorrow, the sub can run the day without texting you at 7:40. Bell schedule, seating, lessons, and who to call in the building.",
  "realtor-showing-day":
    "Addresses, lockboxes, buyer notes, and the 4pm debrief. One sheet for the day so you are not scrolling texts in the driveway.",
  "trades-job-cost-sheet":
    "Materials, hours, dump fees, and whether this job actually paid. Quoted vs spent — that’s the only score that matters.",
  "booth-renter-week":
    "Chair rent, product, tips, and whether the week was worth the booth. Add it up before you book another late Thursday.",
  "shift-handoff":
    "What the next person needs in ninety seconds: open loops, watch-outs, who to call. Write ‘already handled’ so they do not redo your work.",
  "care-visit-log":
    "Who you saw, what they asked, the follow-up you own. Their words, not yours — and a quiet checklist so you do not over-promise.",
  "shoot-day-runsheet":
    "Call time, must-get shots, backup cards, and the client’s non-negotiables. If it isn’t on this page, it isn’t promised.",
  "tutor-session-tracker":
    "What you covered, what they missed, the tiny homework, and the parent note. Ten minutes of homework beats a worksheet they will not open.",
  "unit-turn-checklist":
    "Move-out to list-ready: deposits, paint, keys, and the photos you’ll actually take. Check it off so the listing is not ‘almost.’",
  "appointment-questions":
    "You will forget the questions in the room. Write them now, leave space for what they said, and take this paper in.",
  "symptom-meds-log":
    "Seven days. Time, what you took, what you felt. Bring it — don’t reconstruct Tuesday from memory on Friday.",
  "grocery-protocol-list":
    "Not a meal plan. The actual cart for the way you eat this week. Aisles, swaps, and what you will not buy.",
  "sleep-pain-week":
    "Bedtime, wake, pain, caffeine, screens. One week of marks so you’re not guessing in the exam room.",
  "specialist-history-one-pager":
    "Hand this over instead of reconstructing eleven years in the waiting room. Timeline, meds, allergies, and what you want from today.",
  "hard-week-meal-prep":
    "Night-shift week, sick kid, travel: five boring meals that will actually get eaten. Constraint first, recipes second.",
  "household-runbook":
    "If you got hit by a bus — or a double shift — bills, where the logins live, and who can do it. This is the household OS.",
  "babysitter-one-pager":
    "Bedtimes, allergies, the neighbor, and the number that is actually you. Fridge-door simple.",
  "school-forms-tracker":
    "The packet on the counter. What’s due, what’s signed, what still needs a check. One list so nothing dies in the backpack.",
  "chore-allowance":
    "What ‘done’ means, what it pays, and payday — without a lecture. Kids can read this. That’s the point.",
  "family-calendar-loadout":
    "The week on one page: who is where, meals that match, and the one thing that cannot slip. Protect the immovable first.",
  "emergency-contacts-kit":
    "Fridge-door version: medical, neighbors, insurance, the vet, the church. Fill it once. Update it when someone moves.",
  "moving-week-checklist":
    "Seven days out to the first night: utilities, boxes, and the bag you keep with you. Check the boring stuff so the first night has beds.",
  "content-calendar-ship":
    "Four weeks. One promise per slot. If it isn’t on this page, it isn’t this month. Maybee will not let you add a fifth ‘idea.’",
  "batch-filming-shotlist":
    "One afternoon, six pieces. Shots, B-roll, and the line you always forget. Check ‘got’ so you leave with the day, not a reshoot.",
  "sponsorship-rate-card":
    "What you charge, what’s included, and the kill fee — before they ask for exposure. Send the card. Don’t negotiate from a DM.",
  "launch-week-runbook":
    "T-minus seven to the thank-you email. One owner per task. If it flops at 48 hours, the risk box is already written.",
  "email-sequence-outline":
    "Five emails, one job each. Subject, point, link. Not a novel — If they only read one line, that line has to work.",
  "offer-stack-worksheet":
    "Core offer, bonuses people actually use, price, guarantee, and the ‘not for.’ If you can’t name the not-for, the offer is mush.",
  "audience-research-notes":
    "Ten real comments or emails. The words they use. The product that deletes that sentence. Patterns first, then what you’ll ship.",
  "interview-story-bank":
    "STAR stories you can say out loud. Situation, you, result, number. Practice the 20-second closer — that’s the one they remember.",
  "job-hunt-tracker":
    "One pipeline. No twelve tabs. Applied, heard, interview, offer, no. Update it the same day you hit send.",
  "salary-negotiation-sheet":
    "Range, walk-away, non-cash, and the sentence you’ll use when they go first. Write the number before the call, not during it.",
  "thirty-sixty-ninety":
    "The first three months in a new seat — so you look like you meant to be there. Learn, deliver, then change something that sticks.",
  "brag-sheet-rec-letter":
    "Give them the stories, numbers, and dates so the letter isn’t ‘hard-working team player.’ Make it easy for them to sound specific.",
  "job-prompt-library":
    "Not ‘write a blog post.’ The five prompts you will run this week, with inputs and what done looks like. Job-specific or it doesn’t count.",
  "sop-from-messy-process":
    "You do this from memory. Write the steps once — trigger, steps, done-looks-like — and hand it to a human or a model next time.",
  "client-deliverable-ai-checklist":
    "What the model drafts, what you still touch, and what never ships without a human. Numbers and names are a you job.",
  "mortgage-payment":
    "What the house actually costs each month — principal, interest, tax, insurance. This is PITI if you never throw extra at it. Peek at Prepay if you want the $100-extra version.",
  "house-afford":
    "A DTI-first number before you fall in love with the listing. Income, debts, down payment, and the rate you’ll actually get — then we talk about whether sinking funds still fit.",
  "rent-vs-buy":
    "Five (or N) years of cash out the door — not a vibes argument. Rent plus investing the difference vs payment, tax, insurance, and what you might sell for.",
  "mortgage-prepay":
    "What $100 — or $400 — extra does to the payoff date and the interest. If your savings rate beats the mortgage rate, extra principal is a feeling. Run both.",
  "compare-mortgages":
    "Rate, term, and points on one page. Pick the cheaper all-in, not the prettier payment. Closing costs count.",
  "simple-loan":
    "The payment, the interest, the total. Car, boat, or the couch you should not finance. If the total makes your stomach drop, that’s the answer.",
  "retirement-need":
    "Annual spend, minus Social Security, times a boring rule. That’s the nest-egg number you actually save toward — not a magazine headline.",
  "retirement-payout":
    "What a nest egg throws off each month — a percent rule vs drawing it down over N years. Healthcare will lie to you; this is a planning stick.",
  "workplace-retirement":
    "This year’s deferral plus the match, grown if you do not raid it. The match is free money. The raid is how it disappears.",
  "compound-savings":
    "A number in, a number out, interest in the middle. HYSA, brokerage, the ugly mutual fund — same math. Watch what twenty years does.",
  "tuition-savings":
    "Today’s sticker, grown by inflation, then the monthly save so you are not borrowing the whole thing. One year of school — multiply if you’re being honest.",
  "path-to-million":
    "How long at this deposit and this return — or change the goal if a million is the wrong stick. The date is the point, not the word million.",
  "asset-allocation":
    "A first split: stocks vs ballast. Age in, percentage out. Then you argue with it. If a 20% drop would make you sell, you’re already too heavy.",
  "habit-leak":
    "An $8–15 lunch, the vending machine for random snacks, the quiet coffee. Times a decade vs investing it. No lecture — just the receipt. Name the habit so future-you remembers.",
  "lease-vs-buy":
    "Car or equipment: the payment story vs what you own at the end. Lease can look cheaper monthly and still lose. Check the leftover value.",
};

export const CATEGORY_GUIDES: Record<string, string> = {
  money: "The Sunday-night money pile — bills, paychecks, subscriptions, and the thing you almost bought.",
  calcs: "Plug in the numbers. I’ll show the payment, the nest egg, or whether rent still wins. No lecture — just the receipt.",
  freelance: "Client work gets messy at 11pm. These sheets keep the invoice, the scope, and the goodbye on paper.",
  profession: "Your job is specific. So are these — sub plans, showings, job costs, handoffs, and the unit turn.",
  health: "Write it down before the waiting room. Questions, meds, groceries, sleep, and the week you cannot cook.",
  home: "The household runbook — sitters, forms, chores, who is where, and who to call.",
  creators: "Ship the calendar, not the vibe. Rate cards, launch weeks, and the offer you can say out loud.",
  career: "Interviews, offers, and the letter someone else has to write for you. Stories with numbers.",
  ai: "Prompts and checklists for the actual job — not ‘write a blog post.’ What the model drafts, what you still touch.",
};

export const PAGE_GUIDES = {
  home: "Hi — I’m Maybee. This is a drawer of fillable kits and family calculators. Pick a pain, fill the form, print a clean sheet, or save it under your account. I’ll sit next to each one and tell you what it’s for.",
  helpers:
    "Sixty-five kits. Search or tap a category. Some are forms you fill; the calcs do the math live as you type. I’ll meet you on every page.",
  helperFallback:
    "Fill the fields. Print a clean sheet when you’re ready. Saving and sharing need all-access — filling is always free.",
  pricing:
    "Filling is free. All-access unlocks print, share, and your library — the whole drawer, one membership. Pick a pace that matches how often Sunday night shows up.",
  library:
    "This is your pile. Open a save to keep filling, or start a new kit from the drawer. Nothing here leaves this account unless you share it.",
  libraryEmpty:
    "Nothing saved yet — that’s okay. Browse the drawer, fill something that hurts a little, then hit Save. I’ll keep it here.",
  login:
    "Sign in so your filled kits live here, not just in this browser. Then you can print and share when you need to.",
  share:
    "Someone filled this and sent it over. Print it if you need the paper, or start a blank one of your own from the drawer.",
} as const;

export function kitGuide(helper: HelperDef): string {
  return KIT_GUIDES[helper.id] ?? PAGE_GUIDES.helperFallback;
}

export function categoryGuide(categoryId: string): string {
  return CATEGORY_GUIDES[categoryId] ?? PAGE_GUIDES.helpers;
}
