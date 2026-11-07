"use client";

import { ReactNode, useCallback } from "react";
import { toast } from "sonner";
import { useLazyGetAssetAccessQuery } from "@/src/redux/features/assets/assetsApi";

/** Private files are stored as asset:ID, never as public URLs. */
export function useOpenAsset() {
  const [getAccess, { isFetching }] = useLazyGetAssetAccessQuery();
  const openAsset = useCallback(async (reference: string) => {
    // Reserve a tab synchronously: browsers otherwise block popups after awaited API calls.
    const popup = window.open("about:blank", "_blank");
    if (popup) popup.opener = null;
    try {
      let href = reference;
      if (reference.startsWith("asset:")) {
        const id = reference.slice(6);
        if (!/^[a-f0-9]{24}$/i.test(id)) throw new Error("Invalid file reference");
        const result = await getAccess(id, true).unwrap();
        href = result.data.url;
      }
      const url = new URL(href);
      if (url.protocol !== "https:" && !(url.protocol === "http:" && url.hostname === "localhost")) throw new Error("Invalid document URL");
      if (popup) popup.location.replace(url.toString());
      else window.location.assign(url.toString());
    } catch (error) {
      if (popup) popup.close();
      toast.error(error instanceof Error ? error.message : "Unable to access document");
    }
  }, [getAccess]);
  return { openAsset, isFetching };
}
export function SecureAssetLink({ reference, children, className = "", title }: {
  reference?: string | null; children: ReactNode; className?: string; title?: string;
}) {
  const { openAsset, isFetching } = useOpenAsset();
  if (!reference) return null;
  return <button type="button" className={className} disabled={isFetching} title={title}
    onClick={() => { void openAsset(reference); }}>{children}</button>;
}
