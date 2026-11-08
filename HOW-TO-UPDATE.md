# How to update the HPSA website

You do not need to know how to code. Almost everything is one of these three jobs.

## 1. Show your real standings and leaders

The site reads your Google Sheet charts. Right now it shows **sample data** until you add your links.

1. Open the workbook. Choose **File > Share > Publish to web**.
2. In the first box pick **one tab** (for example, Monday Standings). Do not pick "Entire document".
3. In the second box pick **Comma-separated values (.csv)**, then click **Publish**.
4. Copy the link.
5. Open `config.js`. Under `divisions`, paste the link between the quote marks:

   ```
   monday: {
     name: "Monday",
     standingsUrl: "PASTE THE STANDINGS LINK HERE",
     leadersUrl: "PASTE THE LEADERS LINK HERE"
   },
   ```
6. Repeat for Tuesday and Wednesday.

The first row of each tab must be the column headings (for example Pos, Team, W, L, T, D, Pct, Strk). The site shows whatever columns your tab has, in the same order, and visitors can click any heading to sort.

When someone enters a score in the form, your formulas update the tab and the site follows within a few minutes.

## 2. Change the countdown

Open `config.js` and find `countdown`. Add, change or remove lines in the list:

```
{ label: "Final Payment Due", date: "2027-02-28 23:59" },
{ label: "Opening Day", date: "2027-05-03 18:30" }
```

- Use 24-hour Toronto time: `YYYY-MM-DD HH:MM`.
- The site always counts down to the next date that has not passed yet, so you can add the whole season at once.
- Keep a comma after every line except the last.

**Easier option:** keep the countdown list in its own Google Sheet tab with two columns named `Label` and `Date`, publish that tab as CSV, and paste the link into `sheetUrl`. Then you never need to open `config.js` for countdowns.

## 3. Add or change team logos

1. Make the file name the team name in lowercase with dashes instead of spaces, and remove apostrophes:
   - Globo Gym Purple Cobras becomes `globo-gym-purple-cobras.png`
   - Rosie's Degenerates becomes `rosies-degenerates.png`
   - nWo becomes `nwo.png`
2. Upload it into the `logos` folder. `.png`, `.jpg` and `.webp` all work. Square images look best.
3. A team with no logo shows a coloured badge with its initials, so nothing breaks while you collect them.

If a team name changes, rename its logo file to match, or add a line under `logos` in `config.js` that points the new name to the old file.

## 4. Add a new team (for example, the Crew)

Each team has its own stats workbook. Globo Gym's is the model: copy it for every new team. Teams only get a page on the site once they are added to `config.js` (step G below).

**How a team workbook fits together**

| Tab | What it does |
| --- | --- |
| Game1 to Game17 | The manager types each player's name and stats here, one tab per game. Keep the headings in row 1 and the same columns. |
| Game Info | Fills itself in from the league schedule: opponent, date and result for each game. |
| All Games | Stacks every game into one list and adds the opponent, date and result. The website reads this tab. |
| Master stats (season totals) | Adds up every player across all games, from the All Games tab. The website reads this tab too. |

The ready-made formulas are in the `formulas` folder of the site. Paste each into cell **A1** of its tab by clicking in the **formula bar** (not just the cell).

**A. Copy the workbook.** Open Globo Gym's workbook and choose **File > Make a copy**. Name it for the new team. A copy is not published, so it gets its own links.

**B. Clear the old team's data.** In Game1 to Game17, delete the player names and stats (keep the headings). Type the new team's players as games are played.

**C. Game Info tab.** Click A1 and look at the formula. Change `"Globo Gym Purple Cobras"` to the new team's name, spelled exactly as in the schedule workbook (for example `"Crew"`). The first time, click **Allow access** on the cell. If the formula is missing, paste `formulas/game-info.txt` into A1 and replace `SCHEDULE TAB NAME` with the exact name of the schedule tab.
- The game numbers follow the order of the schedule: the team's first game on the schedule is Game 1, and so on. Enter stats on the matching Game tab.
- The schedule tab must have the columns Date, Home Team, Away Team, Home Score, Away Score, Status (A to F). Results fill in on their own when scores are entered there.

**D. All Games tab.** If the formula is missing, paste `formulas/all-games.txt` into A1. Row 1 should read `Game, Opponent, Date, Result, Player Name, At Bats...`. Do not delete this tab or rename the Game tabs (`Game1`, `Game2` and so on). A deleted tab gets a new link and the site stops reading it.

**E. Master stats tab.** If the formula is missing, clear the tab and paste `formulas/season-totals.txt` into A1. Every name typed on any Game tab appears here with season totals. A name spelled two ways (`Mike` and `Michael`, or an extra space) shows up as two players, so fix the spelling on the Game tab.

**F. Publish two tabs.** Choose **File > Share > Publish to web**. Pick **one tab**, choose **Comma-separated values (.csv)**, then **Publish**, and copy the link. Do it once for **Master stats** and once for **All Games**.

**G. Add the team to `config.js`.** Under `teams`, add a comma after the last `}` and paste a new block:

```
    "crew": {
      name: "Crew",
      division: "monday",
      seasonUrl: "PASTE THE MASTER STATS LINK HERE",
      gamesUrl: "PASTE THE ALL GAMES LINK HERE"
    }
```

The name in quotes on the first line is the team name in lowercase with dashes instead of spaces and no apostrophes (Shift Disturbers becomes `"shift-disturbers"`). `division` is `monday`, `tuesday` or `wednesday`. Commit the change on GitHub. The team's name in the standings then links to its page.

**What visitors see.** Each game is named by its date and opponent, for example "May 4 vs Dodgers", with the result under it. A game with no opponent or date yet shows as "Game 4". Players with no stats in a game are left out of that game, and a game with no stats yet does not appear. Each game page shows the team totals at the bottom.

**If something looks wrong**
- *Game by game says "can't be shown right now":* the All Games link in `config.js` is old, or the tab is not published. If the tab was ever deleted and rebuilt, publish it again and paste the new link.
- *Game Info or All Games shows `#REF!`:* click the cell and click **Allow access**, or check the schedule tab name in the formula.
- *Opponent, date or result is blank:* the team name in the Game Info formula does not match the schedule exactly.
- *Master stats shows the old team's players:* the Game tabs still have the old team's data. Clear them.
- *Page still shows old information:* hard refresh (Ctrl+Shift+R) or use a private window.

## 5. Division leaders for every team

The division leaders table shows whatever is in the tab named by that division's `leadersUrl` in `config.js`. To show every team's players, build one **Division Leaders** tab that reads each team's Master stats tab, then publish it and point `leadersUrl` at it.

1. Open the division's standings workbook (for Monday, the one with the standings tab) and add a tab called **Division Leaders**.
2. Open `formulas/division-leaders.txt`. In it:
   - Replace `MASTER STATS TAB NAME` with the exact name of the Master stats tab (the same in every team workbook).
   - Replace `GLOBO GYM WORKBOOK ID` with the long code from the address of that team's workbook. In `https://docs.google.com/spreadsheets/d/THIS-PART/edit` the code is the part between `/d/` and `/edit`.
   - Do the same for the Crew. To add another team, copy one `t("...","Team name")` entry, separated by a comma, and put in its code and name.
3. Paste the edited formula into A1 of Division Leaders (click in the formula bar). Click **Allow access** each time it asks, once per team workbook.
4. You should see every team's players, with a Team column, sorted by RBI. A team with no stats yet is skipped.
5. Publish that one tab as CSV (**File > Share > Publish to web**) and paste the link into `config.js` as that division's `leadersUrl`. Commit on GitHub.

Each division gets its own Division Leaders tab, with only the teams in that division.

## 6. The schedule (league, division and team pages)

One combined tab feeds three places: the **Schedule** page (every division, with buttons to filter), each **division page** ("Schedule and scores"), and every **team page**. Scores appear everywhere as soon as they are entered.

**How it fits together.** The league **Master** workbook lists every game (the formula reads columns B to H and ignores column A) with its day, date, time, field, division, home and away team. The division score sheets (for example Monday's **Master Schedule** tab) hold the scores. A new tab in the Master workbook called **Site Schedule** combines them: it starts from the Master list and looks up each game's score by **date + home team + away team**.

**Set it up (once):**
1. In the league Master workbook, add a tab called **Site Schedule**.
2. Click A1, click in the formula bar, and paste the formula from `formulas/site-schedule.txt`. Click **Allow access** if it asks.
3. You should see every game with Day, Date, Time, Field, Division, Home, Away, Home Score, Away Score, Status and Week. Games already in the score sheet show their scores.
4. **File > Share > Publish to web**, pick **Site Schedule** (one tab), choose **CSV**, **Publish**, and copy the link.
5. Paste it into `config.js` at the top as `scheduleUrl`, and commit on GitHub.

**Adding Tuesday's and Wednesday's score sheets.** In the formula, find `glook,VSTACK(sl("...","'Master Schedule'"))`. Add another entry after the first, separated by a comma:
`,sl("THE WORKBOOK CODE","'THE TAB NAME'")`
The workbook code is the part of its address between `/d/` and `/edit`. Keep the single quotes around the tab name.

**Rules that keep scores showing:**
- Team names must be spelled the same way in the Master and in the score sheet (for example `Rosie's Degenerates` in both).
- The home team in the Master must be the home team in the score sheet. A game listed the other way round shows no score.
- Dates should be real dates in both sheets, not typed text.
- A game counts as played once **both** scores are numbers. Until then it shows under Upcoming. A Status such as Forfeit or Rain Out shows as a small label.

**What the schedule shows.** Each game shows the day and date (for example "Monday May 4", with no year), time, field, division, the two teams and the scores. The "Week" headings and the status labels (Forfeit, Rain Out) are switched off. To change this, open `config.js` and change `scheduleDisplay`:

```
scheduleDisplay: { date: true, week: true, status: true },
```

Each can be turned on or off separately. With `date: false` a game shows just the day, for example "Monday". Games always stay in date order.

**Divisions.** The site works out each game's division from the **Day** column (Monday, Tuesday, Wednesday) or the **Division** column (Division 5, Division 3, Division 4). These names are in `config.js` for each division (`name` and `aliases`). If a division is renamed, change them there.

**Team pages** need no extra setup. A team's schedule is every game where the team is home or away. A team that has a team page also becomes a link wherever its name appears.

**If something looks wrong**
- *"The schedule can't be shown right now":* the Site Schedule tab is not published, or the link in `config.js` is wrong.
- *Site Schedule shows `#REF!`:* click the cell and click **Allow access**. The tab name in the formula must match the score sheet (`'Master Schedule'`).
- *A game has no score:* the team names, the home/away order or the date differ between the two sheets.
- *A team page says "No games for this team are on the schedule yet":* the team name is spelled differently on the schedule.
- *Times look like decimals:* the formula writes times as text, so paste the formula again if you changed it.

*Older option:* a division can also have its own `scheduleUrl` in `config.js`, pointing at a tab with the columns Date, Home Team, Away Team, Home Score, Away Score, Status (optional: Time, Field, Week). It is only used when the league-wide `scheduleUrl` at the top is empty.

## 7. Playoffs (bracket)

The **Playoffs** page draws a bracket for each division from the **playoffs** tab in the league Master workbook. Change the tab and the bracket follows within a few minutes.

**What the tab needs.** Row 1 holds headings; each game is one row:

| Column | What goes in it |
| --- | --- |
| Date, Time, Diamond | Shown as typed ("Monday Aug 31", "7:00 PM", "Lam 2") |
| Division | `5A`, `5B`, `3`, `4A`, `4B`. The number is the division (5 = Monday, 3 = Tuesday, 4 = Wednesday). The letter is the A or B bracket. A division with no letter (Tuesday) gets a single bracket. |
| Home, Away | The team name, or a seed number (1 to 8) until the teams are known. A seed number shows as "Seed 5" in the semifinals and as "TBD" later on. |
| Round | The words in this column decide where a game goes: **Semi** in the semifinals; **Game 1**, **Game 2**, **Game 3 if needed** in an A final; **Championship** in a single-game final. The heading can be blank or `Round`. |
| Home Score, Away Score | **Add these two columns.** Leave them blank until the game is played. |

Blank rows are ignored, so you can keep blank spacer rows between groups.

**What the page does:**
- Semifinals sit on the left and lead into the final on the right. On a phone they stack, one under the other.
- The winner of each game is shown in bold with the bigger score.
- For a best-of-three final, the page keeps the series count ("Globo Gym lead the series 1-0"). Once a team has won two games it shows the champion, and "Game 3 (if needed)" turns into "Not needed". For a single championship game, the winner is shown as champion.
- Placeholders are fine. You can publish the empty bracket early and fill in team names and scores as you go.

**To connect it:**
1. In the Master workbook choose **File > Share > Publish to web**.
2. Pick the **playoffs** tab (one tab), choose **CSV**, and click **Publish**. Copy the link.
3. Paste it into `config.js` as `playoffsUrl` (near the top), and commit on GitHub.

**When the teams are set:** type the team names into Home and Away for each semifinal row. Once the semifinals are played, type the finalists' names into the final rows (Game 1, Game 2, Game 3). The page does not move teams into the final by itself. The home team of each final game is whoever is in the Home column.

**If something looks wrong**
- *"The playoffs can't be shown right now":* the tab isn't published, or `playoffsUrl` is wrong or empty.
- *A game is missing:* its Division is not in the form 5A, 5B, 3, 4A or 4B, or the Round column doesn't say Semi, Game or Championship.
- *A game sits in the wrong place:* check the words in the Round column.
- *No score shows:* both score cells need a number.
- *A team shows without its logo:* the team name must match the spelling used elsewhere.

## Getting found on Google

The site already has page titles, descriptions, a sitemap (`sitemap.xml`) and a `robots.txt`. Two jobs for you:

1. **Register with Google Search Console (free):** go to search.google.com/search-console, add the site's address, and verify it. Then open **Sitemaps** and enter `sitemap.xml`. This tells Google the site exists.
2. **When hpsa.ca points to this site:** the address `https://hpsa-league.github.io/hpsa-site/` appears in every page's `<link rel="canonical">`, in `sitemap.xml`, `robots.txt` and the structured data on `index.html`. Replace it with `https://hpsa.ca/` in those files.

Other free things that help: make sure the league has a Google Business Profile and that the address of Hendon Park is on it, ask local groups to link to the site, and keep the standings and news fresh.

## Changing the menu or page text

- **Menu names and links:** `config.js`, under `nav`.
- **Colours:** the top of `styles.css`. `--blue`, `--red` and `--navy` control the whole site.
- **Page wording:** open the page's `.html` file (for example `rules.html`) and edit the text between the tags. Pages marked "coming soon" are ready to be built out.

## Publishing changes (GitHub Pages)

1. Open the repository on github.com and click the file you want to change.
2. Click the pencil icon, make the change, then click **Commit changes**.
3. Wait one to two minutes, then refresh the site.

To upload a logo: open the `logos` folder, click **Add file > Upload files**, then **Commit changes**.

GitHub keeps every earlier version, so any change can be undone from the file's **History**.

## If something looks wrong

| What you see | Most likely cause |
| --- | --- |
| "Can't be shown right now" under standings | The tab is no longer published, or the link in `config.js` was pasted wrong. Publish again and re-paste. |
| Standings show sample teams | The link in `config.js` is still empty. |
| A column is missing or in the wrong place | The column heading was renamed or moved in the sheet. |
| A logo does not appear | The file name does not match the team name. Check spelling, dashes and the extension. |
| The whole page is blank | A quote mark or comma was deleted in `config.js`. Use **History** on GitHub to go back one version. |
| Numbers are a few minutes old | Published sheets can lag a little. This is normal. |

## Keep a backup

Download the whole repository as a zip from GitHub (**Code > Download ZIP**) once in a while and keep it in your shared league folder.
