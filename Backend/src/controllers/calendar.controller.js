
import {asyncHandler} from "../utils/asyncHandler.js";
import { google } from "googleapis";


// Step 1: Redirect user to Google's consent screen
export const googleAuth = asyncHandler(async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const scopes = ["https://www.googleapis.com/auth/calendar.events"];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });

  res.redirect(url);
});

// Step 2: Handle redirect from Google after consent
export const redirectGoogleAuth = asyncHandler(async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send("Missing ?code param from Google OAuth");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const { tokens } = await oauth2Client.getToken(code);

  // Send tokens to frontend
  const html = `
    <script>
      window.opener.postMessage(${JSON.stringify(tokens)}, "http://localhost:3001");
      window.close();
    </script>
  `;
  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

// Step 3: Add recurring class to Google Calendar
export const addClass = asyncHandler(async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const refreshToken = req.headers["x-refresh-token"];

  if (!accessToken || !refreshToken || refreshToken === "undefined") {
    return res.status(401).json({ error: "Google Calendar not connected" });
  }

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  auth.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const {
    subject_code,
    subject_name,
    day,
    classroom,
    professor_name,
    start_time,
    end_time,
  } = req.body;

  const dayMap = {
    Monday: "MO",
    Tuesday: "TU",
    Wednesday: "WE",
    Thursday: "TH",
    Friday: "FR",
    Saturday: "SA",
    Sunday: "SU",
  };
  const byDay = dayMap[day] || "MO";

  const startDate = new Date(start_time);
  const untilDate = new Date(startDate);
  untilDate.setMonth(untilDate.getMonth() + 6);
  const untilString = untilDate.toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";

  const calendar = google.calendar({ version: "v3", auth });

  try {
    await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: `${subject_code}: ${subject_name}`,
        description: `Classroom: ${classroom}\nProfessor: ${professor_name}`,
        location: classroom,
        start: { dateTime: start_time, timeZone: "Asia/Kolkata" },
        end: { dateTime: end_time, timeZone: "Asia/Kolkata" },
        recurrence: [`RRULE:FREQ=WEEKLY;BYDAY=${byDay};UNTIL=${untilString}`],
      },
    });
    res.json({ message: "Class added & synced to Google Calendar" });
  } catch (err) {
    console.error("Google Calendar error →", err.errors || err);
    if (err.code === 401) {
      return res.status(401).json({ error: "Google token expired or revoked. Please reconnect." });
    } else if (err.code === 403) {
      return res.status(403).json({ error: "Calendar write scope missing. Reconnect Google Calendar." });
    }
    next(err);
  }
});
