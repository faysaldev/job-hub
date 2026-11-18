"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Bell, KeyRound, ShieldCheck, Trash2, UserRound } from "lucide-react";
import WorkspaceShell from "@/src/components/layout/WorkspaceShell";
import { useAuth } from "@/src/hooks/useAuth";
import { useAppDispatch } from "@/src/redux/hooks";
import { setUser } from "@/src/redux/features/auth/authSlice";
import { useGetMeQuery, useUpdateProfileMutation, useChangePasswordMutation, useDeleteProfileMutation } from "@/src/redux/features/user/userApi";
import { apiErrorMessage, apiFieldErrors } from "@/src/lib/apiErrors";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

type WorkspaceRole = "seeker" | "recruiter";
type Profile = { name?: string; phoneNumber?: string; email?: string };

export default function AccountSettingsPage({ role }: { role: WorkspaceRole }) {
  const { user, token, isAuthenticated, logout } = useAuth();
  const dispatch = useAppDispatch();
  const { data, isFetching, isError, refetch } = useGetMeQuery(undefined, { skip: !isAuthenticated });
  const profile = (data as { data?: Profile } | undefined)?.data;
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [update, { isLoading: savingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: savingPassword }] = useChangePasswordMutation();
  const [deleteProfile, { isLoading: deleting }] = useDeleteProfileMutation();

  useEffect(() => {
    setName(profile?.name ?? user?.name ?? "");
    setPhoneNumber(profile?.phoneNumber ?? user?.phoneNumber ?? "");
  }, [profile?.name, profile?.phoneNumber, user?.name, user?.phoneNumber]);

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({}); setError("");
    try {
      const result = await update({ name: name.trim(), phoneNumber: phoneNumber.trim() }).unwrap();
      const updated = (result as { data?: Profile }).data;
      if (user && token && updated) dispatch(setUser({ user: { ...user, ...updated }, token }));
      toast.success("Account details updated");
    } catch (failure: unknown) {
      setErrors(apiFieldErrors(failure));
      setError(apiErrorMessage(failure, "Unable to save account details."));
    }
  };

  const savePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({}); setError("");
    if (!currentPassword) { setError("Enter your current password."); return; }
    if (!/^(?=.{8,128}$)(?=.*[a-zA-Z])(?=.*\d).+$/.test(newPassword)) {
      setError("New password must be 8–128 characters and contain a letter and a number."); return;
    }
    if (newPassword !== confirmPassword) { setError("New passwords do not match."); return; }
    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      toast.success("Password changed. Please sign in again on this and other devices.");
      logout();
    } catch (failure: unknown) {
      setErrors(apiFieldErrors(failure));
      setError(apiErrorMessage(failure, "Unable to change your password."));
    }
  };

  const removeAccount = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (deleteConfirmation !== "DELETE") { setError("Enter DELETE to confirm account deletion."); return; }
    try {
      await deleteProfile({ password: deletePassword }).unwrap();
      toast.success("Your account has been disabled and all sessions revoked.");
      logout();
    } catch (failure: unknown) {
      setError(apiErrorMessage(failure, "Unable to delete your account."));
    }
  };

  return <WorkspaceShell role={role}>
    <div className="mx-auto max-w-3xl space-y-7 pb-12">
      <header><p className="text-xs font-semibold uppercase tracking-widest text-[#456882]">Your account</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#163b5c]">Account settings</h1>
        <p className="mt-2 text-sm text-slate-600">Manage your account details and security. Changes here apply to your JobHub sign-in.</p></header>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
      {isError && <div role="alert" className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">Account details could not be refreshed. <button type="button" className="underline" onClick={() => refetch()}>Retry</button></div>}

      <section className="rounded-xl border border-[#d9e3ea] bg-white p-6 shadow-sm sm:p-7" aria-labelledby="account-details">
        <div className="mb-5 flex items-center gap-3"><UserRound className="text-[#163b5c]" size={22}/><div><h2 id="account-details" className="text-lg font-semibold text-[#163b5c]">Account details</h2><p className="text-sm text-slate-500">Your name and phone number are editable.</p></div></div>
        <form onSubmit={saveProfile} className="space-y-4">
          <div><label htmlFor="settings-name" className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label><Input id="settings-name" value={name} onChange={event => setName(event.target.value)} minLength={3} maxLength={100} required className="h-11" aria-invalid={!!errors.name}/>{errors.name && <p className="mt-1 text-xs text-red-700">{errors.name}</p>}</div>
          <div><label htmlFor="settings-email" className="mb-1.5 block text-sm font-medium text-slate-700">Email address</label><Input id="settings-email" type="email" value={profile?.email ?? user?.email ?? ""} readOnly disabled className="h-11 bg-slate-50"/><p className="mt-1 text-xs text-slate-500">Email changes require additional verification and are not available for self-service yet.</p></div>
          <div><label htmlFor="settings-phone" className="mb-1.5 block text-sm font-medium text-slate-700">Phone number</label><Input id="settings-phone" type="tel" value={phoneNumber} onChange={event => setPhoneNumber(event.target.value)} minLength={10} maxLength={24} required className="h-11" aria-invalid={!!errors.phoneNumber}/>{errors.phoneNumber && <p className="mt-1 text-xs text-red-700">{errors.phoneNumber}</p>}</div>
          <Button type="submit" disabled={savingProfile || isFetching} className="h-10 bg-[#163b5c] text-white hover:bg-[#245174]">{savingProfile ? "Saving…" : "Save account details"}</Button>
        </form>
      </section>

      <section className="rounded-xl border border-[#d9e3ea] bg-white p-6 shadow-sm sm:p-7" aria-labelledby="password-settings">
        <div className="mb-5 flex items-center gap-3"><KeyRound className="text-[#163b5c]" size={22}/><div><h2 id="password-settings" className="text-lg font-semibold text-[#163b5c]">Password & sessions</h2><p className="text-sm text-slate-500">Changing your password signs out all your devices.</p></div></div>
        <form onSubmit={savePassword} className="space-y-4">
          <div><label htmlFor="settings-current" className="mb-1.5 block text-sm font-medium text-slate-700">Current password</label><Input id="settings-current" type="password" autoComplete="current-password" value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} required className="h-11"/></div>
          <div><label htmlFor="settings-new" className="mb-1.5 block text-sm font-medium text-slate-700">New password</label><Input id="settings-new" type="password" autoComplete="new-password" value={newPassword} onChange={event => setNewPassword(event.target.value)} minLength={8} maxLength={128} required className="h-11"/><p className="mt-1 text-xs text-slate-500">8–128 characters with at least one letter and number.</p>{errors.newPassword && <p className="mt-1 text-xs text-red-700">{errors.newPassword}</p>}</div>
          <div><label htmlFor="settings-confirm" className="mb-1.5 block text-sm font-medium text-slate-700">Confirm new password</label><Input id="settings-confirm" type="password" autoComplete="new-password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} required className="h-11"/></div>
          <Button type="submit" disabled={savingPassword} className="h-10 bg-[#163b5c] text-white hover:bg-[#245174]"><ShieldCheck size={16}/>{savingPassword ? "Updating…" : "Change password"}</Button>
        </form>
      </section>

      <section className="rounded-xl border border-[#d9e3ea] bg-white p-6 shadow-sm sm:p-7" aria-labelledby="preferences">
        <div className="mb-4 flex items-center gap-3"><Bell className="text-[#163b5c]" size={22}/><h2 id="preferences" className="text-lg font-semibold text-[#163b5c]">Other preferences</h2></div>
        <div className="space-y-3 text-sm"><Link href="/notifications" className="block font-medium text-[#163b5c] underline-offset-2 hover:underline">View account notifications</Link>
          {role === "seeker" ? <><Link href="/job-seeker/privacy" className="block font-medium text-[#163b5c] underline-offset-2 hover:underline">Manage profile visibility and recruiter contacts</Link><Link href="/job-seeker/search-alerts" className="block font-medium text-[#163b5c] underline-offset-2 hover:underline">Manage job alert preferences</Link></> : <><Link href="/recruiter/company" className="block font-medium text-[#163b5c] underline-offset-2 hover:underline">Edit your company profile</Link><Link href="/recruiter/team" className="block font-medium text-[#163b5c] underline-offset-2 hover:underline">Manage team access</Link></>}</div>
      </section>

      <section className="rounded-xl border border-red-200 bg-white p-6 shadow-sm sm:p-7" aria-labelledby="remove-account">
        <div className="mb-4 flex items-center gap-3"><Trash2 className="text-red-700" size={22}/><div><h2 id="remove-account" className="text-lg font-semibold text-red-800">Delete account</h2><p className="text-sm text-slate-600">Disables your JobHub account, revokes sessions, and removes your ability to sign in. Certain records may be retained for legal obligations.</p></div></div>
        <form onSubmit={removeAccount} className="space-y-4">
          <div><label htmlFor="settings-delete-password" className="mb-1.5 block text-sm font-medium text-slate-700">Confirm your password</label><Input id="settings-delete-password" type="password" autoComplete="current-password" value={deletePassword} onChange={event => setDeletePassword(event.target.value)} required className="h-11"/></div>
          <div><label htmlFor="settings-delete-confirm" className="mb-1.5 block text-sm font-medium text-slate-700">Type DELETE to confirm</label><Input id="settings-delete-confirm" value={deleteConfirmation} onChange={event => setDeleteConfirmation(event.target.value)} required className="h-11"/></div>
          <Button type="submit" variant="destructive" disabled={deleting || deleteConfirmation !== "DELETE"} className="h-10">{deleting ? "Deleting…" : "Delete my account"}</Button>
        </form>
      </section>
    </div>
  </WorkspaceShell>;
}
