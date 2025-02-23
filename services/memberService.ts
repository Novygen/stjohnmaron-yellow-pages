// services/memberService.ts
import bcrypt from "bcrypt";
import Member from "../models/Member";
import ContactInformation from "../models/ContactInformation";
import MemberMetaData from "../models/MemberMetaData";
import { IMember } from "../models/Member";

interface CreateMemberInput {
  email: string;
  password: string;
  primary_phone_number: string;
}

export async function createMember(input: CreateMemberInput): Promise<IMember> {
  // Hash the password
  const hashedPassword = await bcrypt.hash(input.password, 10);

  // Create ContactInformation document
  const contactInfo = await ContactInformation.create({
    primary_email: input.email,
    password: hashedPassword,
    primary_phone_number: input.primary_phone_number,
  });

  // Create MemberMetaData document with is_approved = false by default
  const metaData = await MemberMetaData.create({
    is_public: false,
    is_approved: false,
  });

  // Create the main Member document referencing the above
  const member = await Member.create({
    contact_information: contactInfo._id,
    member_meta_data: metaData._id,
  });

  return member;
}
