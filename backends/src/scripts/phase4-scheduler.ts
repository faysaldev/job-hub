import mongoose from "mongoose";
import connectionToDb from "../config/db";
import jobService from "../domains/Jobs/job.services";
import { runJobAlerts } from "../domains/SavedJobs/job-alerts.services";
/** Invoke as a scheduled one-off job every 5 minutes, never as an HTTP endpoint. */
(async () => {
  try {
    await connectionToDb();
    const published = await jobService.publishDueJobs();
    const alerts = await runJobAlerts();
    console.log(JSON.stringify({ published, alerts }));
  } catch (error) {
    console.error("Phase 4 scheduler failed", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
})();
