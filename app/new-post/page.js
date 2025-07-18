import { storePost } from "@/lib/posts";
import { redirect } from "next/navigation";
import PostForm from "@/components/post-form";

export default function NewPostPage() {
  // server action
  async function createPost(prevFormState, formData) {
    "use server";
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

    await storePost({ imageUrl: "", userId: 1, title, content });

    redirect("/feed");
  }

  return <PostForm action={createPost} />;
}
