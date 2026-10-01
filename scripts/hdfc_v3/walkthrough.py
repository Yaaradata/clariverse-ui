"""Writes docs/demo-rebuild/WALKTHROUGH_V2.md from the Full-window figures in periods.json, so the script a presenter
reads always matches the screens. Run by scripts/hdfc_pipeline/run_all.sh after the data is built."""

from __future__ import annotations

from common import OUT_APP, ROOT, inr, load


def lakh(n: float) -> str:
    return f"{n / 1e5:.1f} lakh"


def main():
    f = load(OUT_APP / "periods.json")
    p = f["periods"]["all"]
    cp, cx, sp, o, c = p["customer_pulse"], p["cx_pulse"], p["social_pulse"], p["ombudsman"], p["cards"]
    L = {x["id"]: x for x in cp["lists"]}
    i, e = cx["internal"], cx["external"]
    m = cp["mentions"]
    ch = i["by_channel"]
    src = {x["source"]: x for x in sp["by_source"]}
    biz = {x["id"]: x for x in p["businesses"]}
    ci, ce, co = c["internal"], c["external"], c["ombudsman"]
    cat = c["categories"][0]
    sv, mk = c["service_full"], c["market_full"]
    need = [x for x in p["brief"]["needs_you"] if x.get("kind") != "ombudsman"]
    build = p["brief"]["building"]
    imp = p["brief"]["improving"]
    now = o["now"]
    near = now["brink"] + now["eligible"]
    peak = sp["high_impact_peak"]
    mood = c["mood"]
    d_mood = round(mood["net_trend_current"] - mood["net_trend_previous"])
    risk = sorted(o["by_business"], key=lambda x: -x["at_risk"])
    rm = lambda k: f"{inr(L[k]['rm']['alerted'])} of {inr(L[k]['rm']['of'])}"  # noqa: E731
    lst = lambda k: (f"{inr(L[k]['members'])} customers, {inr(L[k]['volume'])} contacts; {inr(L[k]['open'])} open, "  # noqa: E731
                     f"{inr(L[k]['not_responded_48h'])} with no reply in 48 hours")
    pct = lambda a, b: round(100 * a / b) if b else 0  # noqa: E731
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    pk = f"{int(peak['date'][8:])} {months[int(peak['date'][5:7]) - 1]}"

    text = f"""# LisN · HDFC Customer Pulse: walkthrough script (bank-scale numbers)

Written by `scripts/hdfc_v3/walkthrough.py` from the Full-window figures, on every pipeline run. Edit the script, not
this file.

For an internal walkthrough with a manager. About 12 minutes.
**Do** = what to click. **Say** = what to say (in your own words).

Before you start:
- Open `http://localhost:3000/role-based/hdfc`, click **"MD's office & Head of CX · LisN"**, and full-screen the browser.
- Pick a theme with the **Light / Dark** button in the header. The choice sticks for the whole demo.
- In the top-right corner, click **Full window**. The screen opens on Last 7 days; every figure in this script is for **Full window, 1 Jul to 29 Sep 08:30** (public data ends 28 Sep), in the brief of **Tuesday 29 September 2026, 07:45**. Changes compare the second half of the window with the first half.

The left menu has four screens: **MD's office / Head of CX**, **Cards: business view**, **Action queue: escalation emails** and **My view: pinned answers**. The **Ask LisN** bar sits at the bottom of every screen.

**On the numbers.** Internal figures are at HDFC Bank's scale, calibrated to public anchors (`public_anchors_volumes.md`; checked in `qa/volume_validation.md`). They are still illustrative until discovery, and every internal tile says so.

---

## 0. Open (1 min)

**Do:** Land on the MD's office / Head of CX view. Don't scroll yet.

**Say:**
> "One view for the MD's office and the Head of CX, opening with the pulse. One period filter for everything. A Cards business view. And Ask LisN on every screen: the screens show the few things that matter, and everything else is one question away. The volumes are sized to the bank: about {lakh(i['volume'])} contacts and {lakh(o['now']['received'])} complaints a quarter, from HDFC's own published complaint numbers."

---

## 1. The header and the period (30 sec)

**Do:** Point at the top-right: **Morning brief · Last 7 days · Last 30 days · Full window**, then **Light / Dark**.

**Say:**
> "The period filter drives every section on every screen and stays with you as you move. I'll stay on the full window, from 1 July."

---

## 2. Customer pulse: internal channels (2 min)

**Do:** Point at the four list cards under **Internal channels**.

**Say:**
> "The bank's most important customers come first, on the bank's own channels only. Four lists, all the bank's own. Each card shows the list's contacts with the change on the previous period, gauges for what is open and what was not replied to in 48 hours, and the trend of that 48-hour figure.
> Ultra sensitive: {lst('priority_a')}. RBI & Government: {lst('priority_b')}. Ultra HNI: {lst('uhni')}. Multiple relationships, the listed customers holding four or more products: {lst('multi')}."

**Do:** Hover the trend on one card. Point at **RMs alerted**.

**Say:**
> "Hover any trend for the figure behind each week. And RMs alerted: of the listed customers with an alert due, how many RMs have been told. Ultra sensitive {rm('priority_a')}. RBI & Government {rm('priority_b')}. Ultra HNI {rm('uhni')}. Multiple relationships {rm('multi')}. That gap is the point."

---

## 3. Customer pulse: external channels (2 min)

**Do:** Scroll to the tinted **External channels** block below the dashed line. Hover the small (i).

**Say:**
> "Below the line, and never added to the cards above, is public voice: what LisN adds beyond the bank's own systems. These are the posts and reviews we collected, a sample, not a census. {inr(sp['mentions'])} public mentions, {round(e['positive_share'])}% positive and {round(e['negative_share'])}% negative. {inr(sp['high_impact'])} are high impact; {inr(sp['high_impact_responded'])} of those got a response and {inr(e['high_impact']['negative'])} are negative."

**Do:** Click **Peak: {pk} · {inr(peak['count'])} posts** on the High-impact card. Show the list, then click **Show the whole period**.

**Say:**
> "The busiest day for high-impact posts was {pk}, with {inr(peak['count'])}. One click opens that day's posts: anonymised, no names, no links."

**Do:** Point at **Bank response** and **High-priority mentions**.

**Say:**
> "The bank responded to {round(sp['response_pct'])}% of public mentions. That is informational, not a target. Play Store, {round(src['playstore']['pct'])}%, is collected data; App Store {round(src['appstore']['pct'])}%, X {round(src['x']['pct'])}%, Reddit {round(src['reddit']['pct'])}% and forums {round(src['forum']['pct'])}% are illustrative until we collect those replies.
> High-priority mentions are posts where a customer on the bank's lists tagged the bank: {inr(m['total'])}, of which {inr(m['responded'])} were answered, {round(m['response_pct'])}%, and {inr(m['not_responded'])} were not. That chart is the unanswered ones, week by week."

---

## 4. CX pulse: all customer contact (1.5 min)

**Do:** Point at the **Overall contact volume** line, then the **Internal channels** dials and channel table.

**Say:**
> "All customer contact: {inr(i['volume'])} on the bank's own channels since 1 July, and {inr(e['volume'])} collected in public.
> Inside the bank: {inr(i['resolved'])} resolved, {inr(i['open'])} open, {inr(i['waiting_on_customer'])} waiting on the customer, and {inr(i['open_too_long'])} open too long, meaning with the bank for more than 48 hours. {pct(i['negative'], i['volume'])}% of contacts are negative. Calls are the largest channel at {lakh(ch['calls']['volume'])}; then chat {lakh(ch['chat']['volume'])}, email {lakh(ch['emails']['volume'])}, branch {lakh(ch['branch']['volume'])} and WhatsApp {lakh(ch['whatsapp']['volume'])}; the social inbox is {inr(ch['social']['volume'])}. The channels add up to the dials."

**Do:** Point at **External channels**: Total signals and High-impact signals.

**Say:**
> "Outside: {inr(e['positive'])} positive against {inr(e['negative'])} negative, source-weighted. {inr(e['high_impact']['volume'])} posts with reach."

---

## 5. Ombudsman watch (1.5 min)

**Do:** Scroll to **Ombudsman watch**. Point at the four dials, then the bars by business.

**Say:**
> "This is the RBI rule, and only the RBI rule: 30 days to reply to a complaint, and after that the customer can go to the Ombudsman. Of {inr(now['received'])} complaints in the window, {inr(o['pending'])} are still pending a reply.
> On the brink, 10 days or fewer left: {inr(now['brink'])}. Already eligible, past day 30 with no reply: {inr(now['eligible'])}. Those two together are {pct(near, o['pending'])}% of what is pending. Unhappy with the reply, so eligible at any point: {inr(now['unhappy'])}. That is {inr(now['at_risk'])} at risk in all.
> About {pct(o['io']['decided'], now['received'])}% of complaints are partly or fully rejected, {inr(o['io']['decided'])} in the window; each goes to the Internal Ombudsman first, and {inr(now['awaiting_io'])} are waiting for that review now.
> By business, {risk[0]['label']} and {risk[1]['label']} carry the most. LisN shows eligibility and risk; it never predicts that a customer will file."

---

## 6. Today's morning brief (1.5 min)

**Do:** Scroll to **Today's morning brief**. Read across the three columns.

**Say:**
> "The brief, in three columns of three.
> What needs you: the Ombudsman watch leads, with {inr(now['buckets']['0-3'])} complaints at 3 days or fewer and {inr(now['eligible'])} already eligible. Then {need[0]['business_label']}, {need[0]['issue']}: {need[0]['text']} Then {need[1]['business_label']}: {need[1]['text']}
> Signals that are building: {build[0]['issue']} on {build[0]['business_label']}; then {build[1]['issue']} and {build[2]['issue']}.
> What's improving or stable: {imp[0]['business_label']}: {imp[0]['text']} {imp[1]['business_label']}: {imp[1]['text']} {imp[2]['business_label']}: {imp[2]['text']}"

**Do:** Point at the **business cards** and the **Deep dive** button.

**Say:**
> "One card per business. Cards: {inr(biz['cards']['overall_volume'])} contacts; {inr(biz['cards']['internal']['open'])} open and {inr(biz['cards']['internal']['waiting_on_customer'])} waiting on the customer; {pct(biz['cards']['internal']['negative'], biz['cards']['internal']['volume'])}% of its internal contacts are negative. Accounts and deposits: {inr(biz['accounts']['overall_volume'])}. Digital: {inr(biz['digital']['overall_volume'])}. PayZapp and UPI: {inr(biz['payzapp']['overall_volume'])}. Cards has a Deep dive; the others say 'Coming soon'."

---

## 7. Cards: business view (2 min)

**Do:** Click **Deep dive** on the Cards card. Point at the **"Cards · Business view"** label in the header, then **Issue pulse: Cards**.

**Say:**
> "The head of Cards' view; the label stays in the header while you scroll. Same period, same numbers as the Cards card: {inr(ci['volume'])} internal contacts; {inr(ci['resolved'])} resolved, {inr(ci['open'])} open, {inr(ci['waiting_on_customer'])} waiting on the customer, {inr(ci['not_responded_48h'])} not responded to in 48 hours. {inr(ci['negative'])} negative and {inr(ci['escalations'])} escalated. In public: {inr(ce['volume'])} posts and reviews, {inr(ce['positive'])} positive against {inr(ce['negative'])} negative."

**Do:** Scroll past the Cards **Ombudsman watch** and **Save list** to **Issues by category**. Click **{cat['label']}**.

**Say:**
> "The same Ombudsman watch, scoped to Cards: {inr(co['now']['brink'])} on the brink, {inr(co['now']['eligible'])} already eligible. And a save list: the ten complaints to call today, each with why and who owns it. Those ten are sample rows; the counts are bank scale.
> Then issues by category, internal and external side by side. {cat['label']} leads: {inr(cat['internal']['volume'])} contacts, {inr(cat['internal']['open'])} open, {inr(cat['internal']['waiting_on_customer'])} waiting on the customer, {inr(cat['internal']['not_responded_48h'])} not responded to in 48 hours, {inr(cat['internal']['escalations'])} escalated; and {inr(cat['external']['volume'])} public items. The categories add up to the pulse."

**Do:** Scroll to the **three question cards**. Click **Are we keeping our timelines?**, then go back.

**Say:**
> "Three questions, each with its answer on the card and a full page behind it. Are my customers happy: net sentiment {round(mood['net'])}, {'down' if d_mood < 0 else 'up'} {abs(d_mood)} points. What is the market saying: {mk['rising'][0]['label'].lower() if mk['rising'] else 'no theme'} is rising fastest; {inr(mk['reach']['volume'])} posts with reach. Are we keeping our timelines: {inr(sv['missed_timelines']['total'])} public posts describe a missed timeline, {inr(sv['transparency']['count'])} ask where something is, and {inr(sv['tat_related']['contacts'])} contacts, {round(sv['tat_related']['share'])}%, carry a delivery timeline."

---

## 8. Ask LisN (1.5 min)

**Do:** Click the **Ask LisN about your business** bar. Click a suggested question, then **Pin to my view**.

**Say:**
> "Ask LisN suggests about ten questions for the view you are on and answers from the same figures as the page: a short answer and a small table. The answers are precomputed for the demo, and say so."

**Do:** On the Cards view, click **How are Home loans customers doing this week?** Then open **My view**.

**Say:**
> "Role-based access: the head of Cards asks about another business and is told they're not authorised. And pinned answers become panels on My view, for the session."

---

## 9. Action queue (30 sec)

**Do:** Click **Action queue: escalation emails** in the left menu. Point at the **Sample rows** label.

**Say:**
> "The 'act' part: twenty sample escalation emails, sorted into buckets, each with a draft a person approves. This page, like the customer and drill-down pages, shows sample rows, and says so."

---

## 10. Where the data comes from (1 min)

**Say:**
> "Every tile says which kind of data it shows.
> **Public · live** is real: {inr(sp['mentions'])} posts and reviews about HDFC Bank that we collected, 1 July to 28 September.
> **Internal · illustrative** is simulated until discovery, but sized to the bank from public figures: HDFC's own complaint disclosure gives about 1.1 lakh complaints a quarter; we assume 15 to 30 contacts per complaint, which gives 24 lakh; about 12% of contacts are negative; about 10% of complaints are rejected, as at peer banks; the Ultra HNI list is 2 lakh, as Vidya told us. We keep about {inr(f['scale']['sample_rows'])} sample rows and weight them; nothing is stored at millions of rows. Every assumption is logged, and a validation table checks each figure against its anchor on every build.
> No names, handles or links to original posts appear on screen, and totals reconcile across screens and periods."

---

## 11. Close (30 sec)

**Say:**
> "To sum up: the pulse first, internal and external kept apart; one period filter; the Ombudsman watch; a Cards view; and Ask LisN for everything else, all at the bank's scale.
> Decisions for us:
> 1. Are the scale assumptions right: 24 lakh contacts, the channel mix, 12% negative, the 10% reject rate, the list sizes? HDFC's own RBI-format complaint disclosure should replace our anchor before the Anjani meeting.
> 2. Are the simulated response rates believable enough to show?
> 3. Is the Cards layout the template for the other businesses?
> The branch is pushed; it is not merged."

---

## Likely questions (keep handy)

| Question | Answer |
|---|---|
| Is the inside data real? | No. It's simulated and labelled on every tile. The scale is taken from public figures; it becomes real in discovery. |
| Where does 1.1 lakh complaints come from? | HDFC's FY25 disclosure: 4.42 lakh complaints a year, about 1,210 a day, times 13 weeks. |
| Where does 24 lakh contacts come from? | An assumption: 15 to 30 service contacts per complaint. No Indian bank publishes contact volumes. |
| Why is pending about {inr(round(o['pending'], -3))}? | It follows the published stock (16,133 pending at year-end), not a share of one quarter's intake. |
| How many complaints are rejected? | About {pct(o['io']['decided'], now['received'])}%, in line with peer bank disclosures (6-10%). Every one goes to the Internal Ombudsman before the reply. |
| How many reach the RBI Ombudsman? | About 2,400 a quarter in the data (our planning range from peer banks). Each of them was first unhappy with the reply or past day 30 without one. |
| Why is "RMs alerted" smaller than the list? | It counts listed customers with an alert due in the period, never more than the open contacts beside it. |
| Why is the social inbox bigger than the public count? | The inbox is every message to the bank's handles, including direct messages. The public figure is what we collected: a sample. |
| What are "Sample rows"? | Drill-down and customer pages list the rows kept for drill-down; their counts are of those rows, not bank totals. |
| Are the response rates real? | Play Store is collected ({round(src['playstore']['pct'])}%). App Store, X, Reddit and forums are simulated and marked Illustrative. |
| What is "waiting on customer"? | The bank has sent a resolution or proposed one. Not counted as open or as not responded to. |
| Is Ask LisN a live model? | Not in the demo. Suggested questions are answered from the page's own figures and tagged as precomputed. |
| What are full-window changes compared with? | The second half of the window against the first half. |
| Can I click through to the original post? | No, by design. Posts are labelled by platform and date, and names are removed. |
"""
    (ROOT / "docs" / "demo-rebuild" / "WALKTHROUGH_V2.md").write_text(text, encoding="utf-8", newline="\n")
    print("walkthrough: written from the Full-window figures")


if __name__ == "__main__":
    main()
