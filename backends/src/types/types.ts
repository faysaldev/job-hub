export interface ProtectedUser {
  _id: string;
  sessionId: string;
  name: string;
  email: string;
  image?: string;
  role: "seeker" | "recruiter" | "admin";
  phoneNumber?: string;
}
