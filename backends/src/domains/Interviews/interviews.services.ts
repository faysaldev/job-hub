import Interview, { IInterview } from "./interviews.model";
import Application from "../Applications/application.model";
import Conversation from "../Conversations/conversations.model";

const scheduleInterview = async (interviewData: Partial<IInterview>) => {
  const interview = new Interview(interviewData);
  const savedInterview = await interview.save();

  // 1. Update application status to "interview"

  await Application.findOneAndUpdate(
    { job_id: interviewData.job_id, applicant: interviewData.interviewee },
    { status: "interview" },
  );

  // 2. Update conversation status to "interview"
  // Find the conversation for this specific job and these participants
  if (
    interviewData.job_id &&
    interviewData.interviewee &&
    interviewData.interviewer
  ) {
    await Conversation.findOneAndUpdate(
      {
        job_id: interviewData.job_id,
        participants: {
          $all: [interviewData.interviewee, interviewData.interviewer],
        },
      },
      { status: "interview" },
    );
  }

  return savedInterview;
};

const getInterviewsForUser = async (
  userId: string,
  role: "interviewer" | "interviewee",
) => {
  const query =
    role === "interviewer" ? { interviewer: userId } : { interviewee: userId };
  const interviews = await Interview.find(query)
    .populate("application_id")
    .populate("job_id", "title")
    .sort({ date: 1, start_time: 1 });

  if (role === "interviewer") {
    return await Interview.populate(interviews, {
      path: "interviewee",
      select: "name email image",
    });
  } else {
    return await Interview.populate(interviews, {
      path: "interviewer",
      select: "name email image",
    });
  }
};

const updateInterviewStatus = async (interviewId: string, status: string) => {
  return await Interview.findByIdAndUpdate(
    interviewId,
    { status },
    { new: true },
  );
};

const deleteInterview = async (interviewId: string) => {
  return await Interview.findByIdAndDelete(interviewId);
};

const hireCandidate = async (
  jobId: string,
  applicantId: string,
  interviewerId: string,
) => {
  // 1. Update application status to "hired"
  await Application.findOneAndUpdate(
    { job_id: jobId, applicant: applicantId },
    { status: "hired" },
  );

  // 2. Update conversation status to "hired"
  await Conversation.findOneAndUpdate(
    {
      job_id: jobId,
      participants: { $all: [applicantId, interviewerId] },
    },
    { status: "hired" },
  );

  // 3. Update interview status to "completed"
  await Interview.updateMany(
    { job_id: jobId, interviewee: applicantId, status: "scheduled" },
    { status: "completed" },
  );

  return { success: true };
};

const rescheduleInterview = async (
  interviewId: string,
  rescheduleData: { date: string; start_time: string; end_time: string },
) => {
  return await Interview.findByIdAndUpdate(
    interviewId,
    {
      date: rescheduleData.date,
      start_time: rescheduleData.start_time,
      end_time: rescheduleData.end_time,
    },
    { new: true },
  );
};

export default {
  scheduleInterview,
  getInterviewsForUser,
  updateInterviewStatus,
  deleteInterview,
  hireCandidate,
  rescheduleInterview,
};
