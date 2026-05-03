import Interview, { IInterview } from "./interviews.model";
import Application from "../Applications/application.model";

const scheduleInterview = async (interviewData: Partial<IInterview>) => {
  const interview = new Interview(interviewData);
  const savedInterview = await interview.save();

  // Optionally update application status if not already set
  if (interviewData.application_id) {
    await Application.findByIdAndUpdate(interviewData.application_id, {
      status: "interview",
    });
  }

  return savedInterview;
};

const getInterviewsForUser = async (userId: string, role: "interviewer" | "interviewee") => {
  const query = role === "interviewer" ? { interviewer: userId } : { interviewee: userId };
  return await Interview.find(query)
    .populate("application_id")
    .populate("job_id", "title")
    .populate("interviewer", "name email image")
    .populate("interviewee", "name email image")
    .sort({ date: 1, start_time: 1 });
};

const updateInterviewStatus = async (interviewId: string, status: string) => {
  return await Interview.findByIdAndUpdate(interviewId, { status }, { new: true });
};

const deleteInterview = async (interviewId: string) => {
  return await Interview.findByIdAndDelete(interviewId);
};

export default {
  scheduleInterview,
  getInterviewsForUser,
  updateInterviewStatus,
  deleteInterview,
};
