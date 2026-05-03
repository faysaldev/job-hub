import { Interview } from "@/src/types";

export const MOCK_INTERVIEWS: Interview[] = [
  {
    _id: "69f6cb7f31d10d4365effddd",
    application_id: "69f6b8257c4165e083486ba0",
    job_id: {
      _id: "job1",
      title: "Senior Frontend Engineer",
    },
    interviewer: {
      _id: "rec1",
      name: "Sarah Johnson",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    interviewee: "69f123be18c29e2c377647cd",
    date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    start_time: "10:00 AM",
    end_time: "11:00 AM",
    meet_link: "https://meet.google.com/abc-defg-hij",
    type: "video",
    status: "scheduled",
    note: "Initial technical screening with the engineering team.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "69f6cb7f31d10d4365effeee",
    application_id: "69f6b8257c4165e083486bb1",
    job_id: {
      _id: "job2",
      title: "Fullstack Developer",
    },
    interviewer: {
      _id: "rec2",
      name: "Michael Chen",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    interviewee: "69f123be18c29e2c377647cd",
    date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    start_time: "02:30 PM",
    end_time: "03:30 PM",
    meet_link: "https://meet.google.com/xyz-pdqr-stuv",
    type: "video",
    status: "scheduled",
    note: "System design and architecture discussion.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "69f6cb7f31d10d4365efffff",
    application_id: "69f6b8257c4165e083486cc2",
    job_id: {
      _id: "job3",
      title: "UI/UX Designer",
    },
    interviewer: {
      _id: "rec3",
      name: "Emma Wilson",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    interviewee: "69f123be18c29e2c377647cd",
    date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    start_time: "11:00 AM",
    end_time: "12:00 PM",
    meet_link: "",
    type: "in-person",
    status: "completed",
    note: "Portfolio review and culture fit interview.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
