import NotificationsPage from "@/src/Page/Notifications/NotificationsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications | JobHub",
  description:
    "Stay updated with the latest alerts on your job applications, interview schedules, messages, and account activities on JobHub.",
  keywords: [
    "notifications",
    "job alerts",
    "application updates",
    "JobHub alerts",
  ],
};

function notifications() {
  return <NotificationsPage />;
}

export default notifications;
