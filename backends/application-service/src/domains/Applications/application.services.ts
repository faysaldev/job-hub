import User from "./application.model";

const getAllUsers = async () => {
  return await User.find();
};

const userDetails = async (userId: string) => {
  return await User.findById(userId).select(
    "email name phoneNumber role image isEmailVerified"
  );
};

export default { getAllUsers, userDetails };
