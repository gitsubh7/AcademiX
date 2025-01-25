import { google } from "googleapis";

export async function addEventToGoogleCalendar(auth, classData) {
  const calendar = google.calendar({ version: 'v3', auth });
  const event = {
    summary: classData.subject,
    location: classData.classRoom,
    description: 'A class on ' + classData.subject,
    start: {
      dateTime: classData.startTime,
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: classData.endTime,
      timeZone: 'Asia/Kolkata',
    },
    recurrence: [
      `RRULE:FREQ=WEEKLY;BYDAY=${classData.days.join(',')};UNTIL=${classData.recurrenceEnd}`,
    ],
  };

  try {
    const createdEvent = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    console.log(`Recurring event created: ${createdEvent.data.htmlLink}`);
  } catch (err) {
    console.error('Error creating recurring event:', err);
  }
}
