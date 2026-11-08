/* ==========================================================================
   HPSA SITE SETTINGS  -  this is the one file you edit for most changes.
   Only change the text between the quote marks. Keep the commas and quotes.
   ========================================================================== */

window.HPSA = {

  /* ---- Names ---------------------------------------------------------- */
  siteName: "HPSA",
  fullName: "Hendon Park Sports Association",

  /* ---- COUNTDOWN (top of the home page) -------------------------------
     You can change the countdown as many times as you like. List every
     event you want, and the site always counts down to the NEXT one that
     hasn't happened yet. When one passes, it moves to the next on its own.

     Date format:  "YYYY-MM-DD HH:MM"  in 24-hour time, Toronto time.
     Example: "2027-05-03 18:30"  means May 3, 2027 at 6:30 PM.

     EASIER OPTION: keep the list in a Google Sheet instead (columns named
     Label and Date), publish that tab as CSV, and paste the link in
     sheetUrl below. Then you never have to touch this file for countdowns.
     If sheetUrl has a link, it is used instead of the list below.         */
  countdown: {
    sheetUrl: "",
    events: [
      { label: "Final Payment Due", date: "2027-02-28 23:59" }   // end of day, Toronto time
    ],
    afterMessage: "Final payment is now due. Pick your division below for the latest standings."
  },

  /* ---- LEAGUE SCHEDULE -------------------------------------------------
     Paste the published CSV link of the combined "Site Schedule" tab here
     (see HOW-TO-UPDATE.md, section 6). One tab feeds the Schedule page,
     every division page and every team page. While this is empty, the
     per-division scheduleUrl links below (or sample data) are used.        */
  scheduleUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRdoYPZoNeRmA7IqLHM_ceBDQZc52lTnVDIyB3lqzlDGQmLkVQmph0TBMCxpEBTc1Rh4uW4_fhspgXo/pub?gid=270377199&single=true&output=csv",

  /* What the schedule shows. Set any of these to true to bring it back:
       date   : the day and date of each game, e.g. "Monday May 4" (off: just "Monday")
       week   : "Week 1" headings
       status : labels such as Forfeit or Rain Out                           */
  scheduleDisplay: { date: true, week: false, status: false },

  /* ---- PLAYOFFS --------------------------------------------------------
     Paste the published CSV link of the "playoffs" tab here
     (see HOW-TO-UPDATE.md, section 7). While it is empty the page shows
     a sample bracket.                                                     */
  playoffsUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRdoYPZoNeRmA7IqLHM_ceBDQZc52lTnVDIyB3lqzlDGQmLkVQmph0TBMCxpEBTc1Rh4uW4_fhspgXo/pub?gid=473245405&single=true&output=csv",

  /* ---- DIVISIONS -------------------------------------------------------
     For each division, paste the "Publish to web" CSV link of the
     standings tab and the leaders tab (File > Share > Publish to web >
     choose the tab > Comma-separated values (.csv)).
     While a link is empty, the site shows SAMPLE data so you can see
     the layout.

     scheduleUrl is the published CSV of that division's schedule tab
     (columns: Date, Home Team, Away Team, Home Score, Away Score, Status).
     It feeds the Schedule page, the division page and every team page.    */
  divisions: {
    monday: {
      name: "Monday",
      aliases: ["Division 5"],
      scheduleUrl: "",
      standingsUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vST4tdwmHnIc2vsD2i8rw3ezjpMmjXbHuSQIzMPrZ9FNstdFRRxJ94D2b3r5RaoOufs1PiL9bZOqups/pub?gid=1161560956&single=true&output=csv",
      leadersUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vST4tdwmHnIc2vsD2i8rw3ezjpMmjXbHuSQIzMPrZ9FNstdFRRxJ94D2b3r5RaoOufs1PiL9bZOqups/pub?gid=2014465808&single=true&output=csv"
    },
    tuesday: {
      name: "Tuesday",
      aliases: ["Division 3"],
      scheduleUrl: "",
      standingsUrl: "",
      leadersUrl: ""
    },
    wednesday: {
      name: "Wednesday",
      aliases: ["Division 4"],
      scheduleUrl: "",
      standingsUrl: "",
      leadersUrl: ""
    }
  },

  /* ---- TEAM PAGES -------------------------------------------------------
     A team listed here gets its own page (click the team name in the
     standings): season totals plus a page for every game.
     The key is the team name in lowercase with dashes instead of spaces.

       seasonUrl : the published CSV of the team's season totals tab.
       gamesUrl  : the published CSV of ONE combined tab with a row for every
                   player in every game (see HOW-TO-UPDATE.md, section 4).
                   Leave it empty until that tab exists.                      */
  teams: {
    "globo-gym-purple-cobras": {
      name: "Globo Gym Purple Cobras",
      division: "monday",
      seasonUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2Sgq4hJvvpr5x-F5wFaqJsy7XVhZTcWAZDi8UChvq8t_LBo19xdrOkrMODwp25JeEiBPop0pUVw8C/pub?gid=0&single=true&output=csv",
      gamesUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2Sgq4hJvvpr5x-F5wFaqJsy7XVhZTcWAZDi8UChvq8t_LBo19xdrOkrMODwp25JeEiBPop0pUVw8C/pub?gid=217381119&single=true&output=csv"
    },
    "crew": {
      name: "Crew",
      division: "monday",
      seasonUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRok8fnPsReQCVvcvDoHyjTMHN8idZ2VnHasc8s_ilxbnnyogQ2HHPgleiKpnRzFYzjbl_o44ta32aw/pub?gid=0&single=true&output=csv",
      gamesUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRok8fnPsReQCVvcvDoHyjTMHN8idZ2VnHasc8s_ilxbnnyogQ2HHPgleiKpnRzFYzjbl_o44ta32aw/pub?gid=217381119&single=true&output=csv"
    }
  },

  /* In the leaders table, these stats rank lowest-first when sorted
     (so the first click on ERA shows the best, i.e. lowest, ERA).         */
  lowerIsBetter: ["ERA", "WHIP"],

  /* How many leaders to show before "Show all". */
  leadersToShow: 10,

  /* ---- TEAM LOGOS ------------------------------------------------------
     To add a logo: upload an image into the "logos" folder, named after
     the team in lowercase with dashes instead of spaces, e.g.
         Globo Gym Purple Cobras  ->  logos/globo-gym-purple-cobras.png
         Rosie's Degenerates      ->  logos/rosies-degenerates.png
         nWo                      ->  logos/nwo.png
     .png, .jpg and .webp all work. A team with no logo gets a coloured
     badge with its initials.
     If a file name doesn't follow that pattern, list it here instead:     */
  logos: {
    // "Team Name": "logos/some-other-file-name.png"
  },
  logoExtensions: ["png", "jpg", "webp"],

  /* ---- MENU ------------------------------------------------------------ */
  nav: [
    { label: "Divisions", children: [
      { label: "Monday",    href: "monday.html" },
      { label: "Tuesday",   href: "tuesday.html" },
      { label: "Wednesday", href: "wednesday.html" }
    ]},
    { label: "Schedule",             href: "schedule.html" },
    { label: "Playoffs",             href: "playoffs.html" },
    { label: "Rules and Resources",    href: "rules.html" },
    { label: "Community Businesses", href: "businesses.html" },
    { label: "Free Agency",          href: "free-agency.html" },
    { label: "HPSA History",         href: "history.html" },
    { label: "Contact Us",           href: "contact.html" }
  ]
};
