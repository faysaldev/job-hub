import { Response } from "express";
import interviewService from "./interviews.services";
import { asyncHandler } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";

const scheduleInterview = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const interviewData = req.body;
    const userId = req.user?._id;

    // Ensure the current user is the interviewer
    interviewData.interviewer = userId;

    const interview = await interviewService.scheduleInterview(interviewData);

    res.status(httpStatus.CREATED).json(
      response({
        message: "Interview scheduled successfully",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: interview,
      }),
    );
  },
);

const getMyInterviews = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const userId = req.user?._id;
    const { role } = req.query; // "interviewer" or "interviewee"

    if (!userId) {
      return res.status(httpStatus.UNAUTHORIZED).json(
        response({
          message: "Unauthorized",
          status: "ERROR",
          statusCode: httpStatus.UNAUTHORIZED,
        }),
      );
    }

    const interviews = await interviewService.getInterviewsForUser(
      userId.toString(),
      (role as "interviewer" | "interviewee") || "interviewer",
    );

    res.status(httpStatus.OK).json(
      response({
        message: "Interviews retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: interviews,
      }),
    );
  },
);

const updateStatus = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { interviewId } = req.params;
    const { status } = req.body;

    const interview = await interviewService.updateInterviewStatus(
      interviewId,
      status,
    );

    res.status(httpStatus.OK).json(
      response({
        message: "Interview status updated successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: {},
      }),
    );
  },
);

const hireCandidate = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { jobId, applicantId } = req.body;
    const interviewerId = req.user?._id;

    const result = await interviewService.hireCandidate(
      jobId,
      applicantId,
      interviewerId as string,
    );

    res.status(httpStatus.OK).json(
      response({
        message: "Candidate hired successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      }),
    );
  },
);

export default {
  scheduleInterview,
  getMyInterviews,
  updateStatus,
  hireCandidate,
};
