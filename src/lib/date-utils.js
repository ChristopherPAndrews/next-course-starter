import { format, parse } from "date-fns/fp";
import {
  differenceInCalendarDays,
  compareDesc,
  isSameDay,
  parseISO,
  compareAsc,
} from "date-fns";

export const displayDate = format("iiii, MMM d");

export function inWeek(event, weekStart) {
  const difference = differenceInCalendarDays(event, weekStart);
  return difference >= 0 && difference < 7;
}

export function findAssignments(files) {
  const tmp = [];

  files.forEach((entry) => {
    if (entry.type === "node" && entry.published && entry.due) {
      const dates = Array.isArray(entry.due) ? entry.due : [entry.due];

      dates.forEach((date, index) => {
        if (entry.deliverables) {
          tmp.push({
            ...entry,
            name: entry.deliverables[index],
            dueDate: parseISO(date),
          });
        } else {
          tmp.push({ ...entry, dueDate: parseISO(date) });
        }
      });
    } else if (entry.type === "directory") {
      tmp.push(...findAssignments(entry.children));
    }
  });

  tmp.sort((a, b) => compareDesc(a.dueDate, b.dueDate));
  return tmp;
}

function processWeek(weekData, assignments) {
  const week = {
    startDate: new Date(`${weekData.week}T12:00`),
    dated: [],
    undated: [],
  };

  // partial function for parsing days of the week
  // this is a little hacky because parse isn't expecting
  // a start date, it expects a partial date
  // our date doesn't and day combo aren't valid
  // may require a different answer one day
  const findDate = parse(week.startDate, "iii");

  // sift the entries into dated and undated categories
  weekData.entries.forEach((item) => {
    const newItem = {
      entries: typeof item.text === "string" ? [item.text] : [...item.text],
    };

    if (item.day) {
      newItem.date = findDate(item.day);
      week.dated.push(newItem);
    } else {
      week.undated.push(newItem);
    }
  });

  const currentAssignments = assignments.filter((assignment) =>
    inWeek(assignment.dueDate, week.startDate)
  );

  while (currentAssignments.length > 0) {
    const assignment = currentAssignments.pop();
    const assignmentText = `**Due** [${assignment.name}](.${assignment.path})`;

    let day;
    // try to find a matching day
    for (let i = 0; i < week.dated.length; i++) {
      if (isSameDay(week.dated[i].date, assignment.dueDate)) {
        day = week.dated[i];
        break;
      }
    }

    // if not, add a new entry into dated
    if (!day) {
      day = {
        date: assignment.dueDate,
        entries: [],
      };
      week.dated.push(day);
    }

    // add the assignment
    day.entries.push(assignmentText);
  }

  week.dated.sort((a, b) => compareAsc(a.date, b.date));

  return week;
}

export function buildCalendarData(calData, assignments) {
  const calendar = calData.weeks.map((week) => processWeek(week, assignments));
  calendar.sort((a, b) => compareAsc(a.startDate, b.startDate));
  return calendar;
}
