import mongoose from 'mongoose';

export interface ICompany extends Document {
  userId: mongoose.Types.ObjectId;
  companyLogo?: string;
  companyName: string;
  industries: string[];
  companySize: string;
  companyLocation: string;
  website?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyLogo: { type: String },
  companyName: {
    type: String,
    required: true
  },
  industries: [{ type: String }],
  companySize: { type: String },
  companyLocation: { type: String },
  website: { type: String },
  description: { type: String },
}, {
  timestamps: true
});

export default mongoose.model<ICompany>('Company', companySchema);
