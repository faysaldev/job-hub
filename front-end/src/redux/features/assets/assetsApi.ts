import { baseApi } from "@/src/redux/baseApi/baseApi";
import { AssetKind, fileSignatureMatches, resolvedMime, validateAssetFile } from "@/src/lib/assetUpload";

export type { AssetKind } from "@/src/lib/assetUpload";
export interface ManagedAsset { url: string; assetId: string; kind: AssetKind; publicId: string; fileName: string; mimeType: string; size: number }
type Envelope<T> = { data: T; status?: string; message?: string };
type UploadInput = { file: File; kind: AssetKind } | FormData;
const getUpload = (input: UploadInput): { file: File; kind: AssetKind } => {
  if (input instanceof FormData) {
    const file = input.get("file");
    if (!(file instanceof File)) throw new Error("Choose a file to upload");
    return { file, kind: "avatar" }; // Existing multipart callers remain compatible.
  }
  return input;
};
const uploadError = (reason: string) => ({ status: "CUSTOM_ERROR" as const, error: reason });

const assetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<Envelope<ManagedAsset>, UploadInput>({
      async queryFn(input, _api, _extraOptions, baseQuery) {
        try {
          const { file, kind } = getUpload(input);
          const message = validateAssetFile(file, kind);
          if (message) return { error: uploadError(message) };
          const mimeType = resolvedMime(file);
          const bytes = new Uint8Array(await file.slice(0, 32).arrayBuffer());
          if (!fileSignatureMatches(mimeType, bytes))
            return { error: uploadError("File contents do not match the selected format. Choose a valid file.") };
          const start = await baseQuery({ url: "/assets/uploads", method: "POST", body: {
            kind, fileName: file.name, size: file.size, mimeType,
          } });
          if (start.error) return { error: start.error };
          const signed = (start.data as Envelope<{ assetId: string; uploadUrl: string; headers: Record<string, string> }>).data;
          if (!signed?.uploadUrl || !signed.assetId) return { error: uploadError("Storage service did not return an upload URL.") };
          let put: Response;
          try {
            // Never attach API credentials or cookies to a presigned R2 upload.
            put = await fetch(signed.uploadUrl, { method: "PUT", headers: signed.headers, body: file, credentials: "omit" });
          } catch {
            return { error: uploadError("R2 could not be reached. Check your connection or storage CORS configuration and retry.") };
          }
          if (!put.ok && put.status !== 412) {
            const explanation = put.status === 403 ? "The upload URL was denied or expired. Try selecting the file again."
              : put.status === 413 ? "The file exceeds the storage size limit."
              : put.status === 400 ? "R2 rejected the upload. Verify the file type and bucket configuration."
              : `R2 upload failed (HTTP ${put.status}). Please retry.`;
            return { error: uploadError(explanation) };
          }
          // The server verifies R2 HEAD, exact bytes, content type and signature before this is usable.
          const done = await baseQuery({ url: `/assets/uploads/${signed.assetId}/complete`, method: "POST" });
          if (done.error) return { error: done.error };
          return { data: done.data as Envelope<ManagedAsset> };
        } catch (error) {
          return { error: uploadError(error instanceof Error ? error.message : "Upload failed") };
        }
      },
    }),
    getAssetAccess: builder.query<Envelope<{ url: string; expiresIn: number | null }>, string>({
      query: (id) => ({ url: `/assets/${id}/access`, method: "GET" }),
      keepUnusedDataFor: 0,
    }),
  }),
});
export const { useUploadFileMutation, useLazyGetAssetAccessQuery } = assetsApi;
