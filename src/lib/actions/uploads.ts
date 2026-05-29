"use server";

import "server-only";

import { randomUUID } from "node:crypto";

import { createServerClient } from "@/lib/supabase/server";
import { IMAGE_EXT, MAX_IMAGE_BYTES } from "@/lib/utils/image-upload";

export type UploadResult =
  | { success: true; url: string }
  | { success: false; error: string };

type Bucket = "article-images" | "article-covers" | "testimonial-photos";

/**
 * Shared image upload: auth-gates, re-validates MIME + size on the server
 * (defense-in-depth — the client validates too), then writes to the bucket
 * under a random filename and returns the public URL.
 *
 * Uses the cookie-bound server client so the storage RLS policy
 * (authenticated INSERT) applies; never the service-role client.
 */
async function uploadImage(bucket: Bucket, file: File): Promise<UploadResult> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Sesi habis. Login ulang, ya." };
  }

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "File tidak ditemukan. Coba pilih ulang." };
  }

  const ext = IMAGE_EXT[file.type];
  if (!ext) {
    return {
      success: false,
      error: "Format file tidak didukung. Pakai JPG, PNG, atau WebP.",
    };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { success: false, error: "Ukuran maksimal 5MB." };
  }

  const path = `${randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    console.error(`[uploadImage:${bucket}] upload failed`, error);
    return { success: false, error: "Gagal mengunggah gambar. Coba lagi." };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);
  return { success: true, url: publicUrl };
}

export async function uploadArticleImage(file: File): Promise<UploadResult> {
  return uploadImage("article-images", file);
}

export async function uploadArticleCover(file: File): Promise<UploadResult> {
  return uploadImage("article-covers", file);
}

export async function uploadTestimonialPhoto(file: File): Promise<UploadResult> {
  return uploadImage("testimonial-photos", file);
}
