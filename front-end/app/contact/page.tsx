import ContactPage from "@/src/Page/Contact/ContactPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | JobHub",
  description:
    "Get in touch with the JobHub team. Whether you need technical support, sales information, or have a general inquiry, our global team is ready to help.",
  keywords: [
    "contact JobHub",
    "customer support",
    "JobHub help",
    "sales inquiry",
    "contact recruitment platform",
  ],
};

export default function Page() {
  return <ContactPage />;
}

