"use client";
import styles from "./announcement-bar.module.css";

export default function AnnouncementBar() {
  return (
    <div className={styles.announcementBar}>
      <div className={styles.content}>
        <span className={styles.icon}>📢</span>
        <p className={styles.text}>
          All Buildchem Solutions Corporation branches will be closed on{" "}
          <span className={styles.badge}>November 1–2</span>. Regular office
          operations will resume on{" "}
          <span className={styles.badge}>Tuesday, November 3, 2026</span>.
          Thank you.
        </p>
      </div>
    </div>
  );
}