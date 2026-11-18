import Conversation from "./conversations.model";
import Job from "../Jobs/job.model";
import Application from "../Applications/application.model";
import User from "../User/user.model";
import { AppError } from "../../lib/errors";
import { assertId } from "../../lib/query";
import { companyForActor } from "../Company/company.access";
import Seeker from "../Seeker/seeker.model";

const ensureParticipant = async (conversationId: string, userId: string) => {
  assertId(conversationId, "conversation ID");
  const conversation = await Conversation.findOne({ _id: conversationId, participants: userId });
  if (!conversation) throw new AppError("Conversation not found", 404);
  return conversation;
};

const findConversationByParticipantsService = async (ids: string[], currentUserId: string) => {
  if (ids.length !== 2 || !ids.includes(currentUserId)) throw new AppError("Invalid participants", 400);
  ids.forEach((id) => assertId(id, "participant"));
  return Conversation.findOne({ participants: { $all: ids, $size: 2 } })
    .populate("participants", "name email image");
};
const createConversationService = async (ids: string[], currentUserId: string,
  metadata: { status?: string; role?: string; job_id?: string } = {}) => {
  if (ids.length !== 2 || ids[0] === ids[1] || !ids.includes(currentUserId)) {
    throw new AppError("Private conversation requires two distinct participants", 400);
  }
  ids.forEach((id) => assertId(id, "participant"));
  if (metadata.job_id) {
    const job = await Job.findById(assertId(metadata.job_id, "job ID")).select("author");
    if (!job || !ids.includes(job.author.toString()) ||
        !(await Application.exists({ job_id: job._id, applicant: { $in: ids }, isWithdrawn: { $ne: true } }))) {
      throw new AppError("Conversation must correspond to an application", 403);
    }
  } else {
    const users = await User.find({ _id: { $in: ids }, isDeleted: { $ne: true }, isEmailVerified: true })
      .select("role").lean();
    if (users.length !== 2 || !users.some((user) => user.role === "recruiter") ||
        !users.some((user) => user.role === "seeker")) throw new AppError("Conversation is not permitted", 403);
    const recruiterId = users.find((user) => user.role === "recruiter")!._id;
    const seekerId = users.find((user) => user.role === "seeker")!._id;
    // Team recruiters can contact candidates for applications belonging to their active workspace.
    // Revoked team members must not open new threads by knowing a candidate's user ID.
    const { company } = await companyForActor(String(recruiterId), "applications");
    const jobs = await Job.distinct("_id", { $or: [
      { companyId: company._id }, { author: company.userId }] });
    if (!(await Application.exists({ applicant: seekerId, job_id: { $in: jobs }, isWithdrawn: { $ne: true } }))) {
      throw new AppError("Conversation requires an active application with your company", 403);
    }
    // Direct recruiter-initiated conversations respect a seeker's contact preference.
    // Application-specific ATS transitions can still notify through their separate authorized flow.
    if (String(recruiterId) === currentUserId &&
        !(await Seeker.exists({ userId: seekerId, "privacy.allowContact": true })))
      throw new AppError("Candidate does not allow direct contact", 403);
  }
  let conversation = await Conversation.findOne({ participants: { $all: ids, $size: 2 } });
  if (conversation) {
    // Never allow untrusted conversation creation to overwrite unrelated metadata.
    await Conversation.updateOne({ _id: conversation._id }, { $pull: { hiddenFor: currentUserId } });
    return Conversation.findById(conversation._id);
  }
  conversation = await Conversation.create({ participants: ids,
    ...(metadata.job_id ? { status: metadata.status, role: metadata.role, job_id: metadata.job_id } : {}) });
  return conversation;
};
const deleteConversationService = async (id: string, userId: string) => {
  await ensureParticipant(id, userId);
  // 'Delete' means hide from this member only; preserve the other member's history.
  await Conversation.updateOne({ _id: id, participants: userId }, { $addToSet: { hiddenFor: userId } });
  return { hidden: true };
};
const getUserConversationsService = async (userId: string) => {
  assertId(userId, "user ID");
  const conversations = await Conversation.find({ participants: userId, hiddenFor: { $ne: userId } })
    .populate("participants", "name email image").sort({ updatedAt: -1 }).limit(100).lean();
  return conversations.map((conv) => ({ ...conv, participants: conv.participants.filter((p: any) =>
    p?._id?.toString() !== userId) }));
};
const findConversationByTwoUsers = (id1: string, id2: string) =>
  Conversation.findOne({ participants: { $all: [id1, id2], $size: 2 } }).populate("participants", "name email image");
export default { ensureParticipant, findConversationByParticipantsService, createConversationService,
  deleteConversationService, getUserConversationsService, findConversationByTwoUsers };
