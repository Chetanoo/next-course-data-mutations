"use server";

// server action
import { redirect } from "next/navigation";
import { storePost, updatePostLikeStatus } from "@/lib/posts";
import { uploadImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function createPost(prevFormState, formData) {
  const title = formData.get("title");
  const content = formData.get("content");
  const image = formData.get("image");

  const errors = [];

  if (!title || !title.length) {
    errors.push("Title is required");
  }

  if (!content || !content.length) {
    errors.push("Content is required");
  }

  if (!image || image.size === 0) {
    errors.push("Image is required");
  }

  if (errors.length) {
    return { errors };
  }

  let imageUrl;

  try {
    imageUrl = await uploadImage(image);
  } catch (e) {
    throw new Error("Upload image failed for upload image");
  }

  await storePost({ imageUrl: imageUrl, userId: 1, title, content });

  redirect("/feed");
}

export async function togglePostLikeStatus(postId) {
  await updatePostLikeStatus(postId, 2);
  revalidatePath("/", "layout");
}
