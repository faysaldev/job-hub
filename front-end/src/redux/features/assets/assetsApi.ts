import { baseApi } from "@/src/redux/baseApi/baseApi";

export type AssetKind = "avatar" | "company-logo" | "resume" | "attachment";
export interface ManagedAsset { url: string; assetId: string; kind: AssetKind; publicId: string; fileName: string; mimeType: string; size: number }
type Envelope<T> = { data: T; status?: string; message?: string };
type UploadInput = { file: File; kind: AssetKind } | FormData;
const getUpload = (input: UploadInput): { file: File; kind: AssetKind } => {
  if (input instanceof FormData) {
    const file = input.get("file");
    if (!(file instanceof File)) throw new Error("Select an image to upload");
    return { file, kind: "avatar" }; // Compatibility with original uploadFile(FormData) callers.
  }
  return input;
};

const detectMime = (file: File) => {
  if (file.type && file.type !== "application/octet-stream") return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();
  const known: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp",
    pdf: "application/pdf", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
  return known[ext || ""] || "";
};

const assetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<Envelope<ManagedAsset>, UploadInput>({
      async queryFn(input, _api, _extraOptions, baseQuery) {
        try {
          const { file, kind } = getUpload(input);
          const mimeType = detectMime(file);
          const start = await baseQuery({ url: "/assets/uploads", method: "POST", body: {
            kind, fileName: file.name, size: file.size, mimeType,
          } });
          if (start.error) return { error: start.error };
          const signed = (start.data as Envelope<{ assetId: string; uploadUrl: string; headers: Record<string, string> }>).data;
          // This fetch deliberately omits API cookies and bearer tokens: the URL is already signed.
          const put = await fetch(signed.uploadUrl, { method: "PUT", headers: signed.headers, body: file });
          if (!put.ok && put.status !== 412) throw new Error(`R2 upload failed (${put.status}). Check bucket CORS settings.`);
          // A 412 means an immutable upload key was already written; confirm checks size + signature.
          const done = await baseQuery({ url: `/assets/uploads/${signed.assetId}/complete`, method: "POST" });
          if (done.error) return { error: done.error };
          return { data: done.data as Envelope<ManagedAsset> };
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", error: error instanceof Error ? error.message : "Upload failed" } };
        }
      },
      // File upload itself should not refetch unrelated application data.
    }),
    getAssetAccess: builder.query<Envelope<{ url: string; expiresIn: number | null }>, string>({
      query: (id) => ({ url: `/assets/${id}/access`, method: "GET" }),
      // This is a short-lived sensitive URL; do not cache it in the global RTK store.
      keepUnusedDataFor: 0,
    }),
  }),
});
export const { useUploadFileMutation, useLazyGetAssetAccessQuery } = assetsApi;
