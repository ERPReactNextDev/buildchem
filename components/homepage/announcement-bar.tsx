"use client";
import styles from "./announcement-bar.module.css";

export default function AnnouncementBar() {
  return (
    <div className={styles.announcementBar}>
      <div className={styles.content}>
        <span className={styles.icon}>📢</span>
        <p className={styles.text}>
          Temporary Office Suspension for the ASEAN Summit from{" "}
          <span className={styles.badge}>Nov. 16–18, 2026</span>. Regular Office
          Operations Will Resume on{" "}
          <span className={styles.badge}>Thursday, November 19, 2026</span>.
          Thank You.
        </p>
      </div>
    </div>
  );
}
