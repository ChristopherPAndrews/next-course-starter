import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import Calendar from "../components/Calendar";
import Upcoming from "../components/Upcoming";
import data from "../../content/calendar.json";
import config from "../../site.config";
import fileList from "../../content/sitemap.json";
import { findAssignments, buildCalendarData } from "../lib/date-utils";

export default function Home() {
  const [calendarData, setCalData] = useState();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const tmpAssignments = findAssignments(fileList);
    setAssignments(tmpAssignments);
    setCalData(buildCalendarData(data, tmpAssignments));
  }, []);

  const links = config.links.map((entry) => (
    <li key={entry.name}>
      <Link href={entry.link}>{entry.name}</Link>
    </li>
  ));

  return (
    <>
      <h1 className={styles.title}>{config.name}</h1>

      <div>
        <h2>Important Links</h2>

        <div className={styles.linkBox}>
          <ul>
            <li>
              <Link href="/info">Course Information</Link>
            </li>
            {links}
          </ul>
        </div>
      </div>

      <div>
        <h2>Schedule</h2>
        <em>This is a living schedule and subject to change</em>
        <div className={styles.calendarBox}>
          {assignments && <Upcoming assignments={assignments} />}
          {calendarData && <Calendar data={calendarData} />}
        </div>
      </div>
    </>
  );
}
