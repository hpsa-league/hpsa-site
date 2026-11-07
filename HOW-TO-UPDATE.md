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

## 4. Show game-by-game stats for a team

A team with its own page (Globo Gym, to start) shows its season totals and a page for every game.

1. In the workbook, make a new tab called **All Games** (click the + at the bottom left).
2. Click cell **A1**. Then click in the formula bar at the top (not just the cell) and paste the formula from `all-games-formula.txt`. It stacks Game1 to Game17 into one list with a Game column.
   - It assumes the tabs are named exactly `Game1`, `Game2` and so on, with the headings in row 1 and players in rows 2 to 20, columns A to P. If your tab names have a space (`Game 1`), change them to match.
3. Publish that one tab: **File > Share > Publish to web**, pick **All Games**, choose **Comma-separated values (.csv)**, then **Publish**.
4. Paste the link into `config.js` under `teams`, next to `gamesUrl`.

Players with no stats in a game are left out of that game, and a game with no stats yet does not appear in the list. Each game page shows the team totals at the bottom, and AVG, OBP and SLG are worked out from the totals.

**Opponent, date and result:** make a tab called **Game Info** with the headings `Game`, `Opponent`, `Date`, `Result` in row 1, then one row per game (`Game 1`, `Game 2` and so on, typed exactly like that). Fill in a row after each game, for example `Game 4`, `Vendetta`, `Jun 3`, `W 12-8`. Then put the formula from `all-games-formula-with-details.txt` in cell A1 of the **All Games** tab (replacing the old one). The link does not change. On the site, each game is then named by its date and opponent (for example "Jun 3 vs Vendetta"), and games with no opponent or date yet still show as "Game 4".

**Adding a team:** copy the Globo Gym block under `teams` in `config.js`, change the name (the key is the name in lowercase with dashes), and add its two links. Its name in the standings then links to its page.

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
