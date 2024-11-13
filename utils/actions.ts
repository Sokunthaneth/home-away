"use server";

import db from "./db";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { imageSchema, profileSchema, validateWithZodSchema } from "./schemas";
import { uploadImage } from "./supabase";

const prisma = new PrismaClient();

const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Please login to create a profile");
  if (!user.privateMetadata?.hasProfile) redirect("/profile/create");
  return user;
};

const renderError = (error: unknown): { message: string } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : "An error occurred",
  };
};

export const createProfileAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const user = await currentUser();
    console.log(user);
    if (!user) throw new Error("Please login to create a profile");

    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    await prisma.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? "",
        ...validatedFields,
      },
    });
    (await clerkClient()).users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    });
  } catch (error) {
    return renderError(error);
  } finally {
    await prisma.$disconnect();
  }

  redirect("/");
};

export const fetchProfileImage = async () => {
  const user = await currentUser();

  if (!user) return null;
  try {
    const profile = await prisma.profile.findUnique({
      where: { clerkId: user.id },
      select: {
        profileImage: true,
      },
    });

    return profile?.profileImage;
  } finally {
    await prisma.$disconnect();
  }

  await prisma.$disconnect();
};

export const fetchProfile = async () => {
  const user = await getAuthUser();

  try {
    const profile = await prisma.profile.findUnique({
      where: { clerkId: user.id },
    });

    if (!profile) redirect("/profile/create");
    return profile;
  } finally {
    await prisma.$disconnect();
  }
};

export const updateProfileAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    await prisma.profile.update({
      where: { clerkId: user.id },
      data: validatedFields,
    });

    revalidatePath("/profile");
    return { message: "update profile actions" };
  } catch (error) {
    return renderError(error);
  } finally {
    await prisma.$disconnect();
  }
};

export const updateProfileImageAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  try {
    const image = formData.get("image") as File;
    const validatedFields = validateWithZodSchema(imageSchema, { image });
    const fullPath = await uploadImage(validatedFields.image);

    await prisma.profile.update({
      where: {
        clerkId: user.id,
      },
      data: {
        profileImage: fullPath,
      },
    });
    revalidatePath("/profile");

    return { message: "Profile image updated successfully" };
  } catch (error) {
    return renderError(error);
  } finally {
    await prisma.$disconnect();
  }
};
