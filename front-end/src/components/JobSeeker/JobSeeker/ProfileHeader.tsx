"use client";

import { memo, useRef, useState } from "react";
import { Controller, Control, UseFormRegister } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { User, Mail, Phone, MapPin, Camera } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Select from "react-select";
import { cn } from "@/src/lib/utils";
import { ProfileFormValues } from "@/src/types";
import { useCityOptions } from "@/src/hooks/useCityOptions";

interface ProfileHeaderProps {
  editing: boolean;
  control: Control<ProfileFormValues>;
  register: UseFormRegister<ProfileFormValues>;
  currentUser: any;
  profileData: any;
  imagePreview: string | null;
  onImageChange: (file: File, preview: string) => void;
}

const ProfileHeader = memo(
  ({
    editing,
    control,
    register,
    currentUser,
    profileData,
    imagePreview,
    onImageChange,
  }: ProfileHeaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cityOptions = useCityOptions();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => onImageChange(file, reader.result as string);
      reader.readAsDataURL(file);
    };

    return (
      <Card className="p-8 border-[#456882]/30 bg-white shadow-xl rounded-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#234C6A] via-[#456882] to-[#234C6A]" />
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Avatar */}
          <div className="flex-shrink-0 relative group">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div
              className={cn(
                "bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-3xl p-1 w-32 h-32 flex items-center justify-center shadow-lg transition-all duration-300",
                editing
                  ? "cursor-pointer hover:scale-105"
                  : "group-hover:scale-105",
              )}
              onClick={() => editing && fileInputRef.current?.click()}
            >
              <div className="bg-gray-50 border-4 border-white rounded-2xl w-28 h-28 flex items-center justify-center overflow-hidden relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-14 w-14 text-[#234C6A]" />
                )}
                {editing && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Camera className="text-white h-8 w-8" />
                  </div>
                )}
              </div>
            </div>
            {editing && (
              <Badge
                className="absolute -bottom-2 -right-2 bg-white text-[#234C6A] border-[#234C6A]/20 shadow-md cursor-pointer hover:bg-gray-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-3 w-3 mr-1" /> Change
              </Badge>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="space-y-1">
              {editing ? (
                <Input
                  {...register("name")}
                  placeholder="Your Full Name"
                  className="text-2xl font-bold border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A] bg-gray-50 max-w-md h-12"
                />
              ) : (
                <h3 className="text-3xl font-extrabold text-[#234C6A]">
                  {profileData?.userId?.name || currentUser?.name}
                </h3>
              )}
              {editing ? (
                <Input
                  {...register("headline")}
                  placeholder="Professional Headline"
                  className="mt-2 text-lg border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A] bg-gray-50"
                />
              ) : (
                <p className="text-xl text-[#456882] font-medium italic">
                  {profileData?.designation || "No headline set"}
                </p>
              )}
            </div>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-[#456882] mt-4 font-medium">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#234C6A]/10 rounded-lg">
                  <Mail className="h-4 w-4 text-[#234C6A]" />
                </div>
                <span>{currentUser?.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#234C6A]/10 rounded-lg">
                  <Phone className="h-4 w-4 text-[#234C6A]" />
                </div>
                {editing ? (
                  <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <PhoneInput
                        placeholder="Enter phone number"
                        {...field}
                        className="flex h-8 w-full rounded-md border border-[#456882]/30 bg-background px-3 py-2 text-sm"
                      />
                    )}
                  />
                ) : (
                  <span>
                    {profileData?.userId?.phoneNumber || "No phone added"}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#234C6A]/10 rounded-lg">
                  <MapPin className="h-4 w-4 text-[#234C6A]" />
                </div>
                {editing ? (
                  <div className="min-w-[200px]">
                    <Controller
                      control={control}
                      name="location"
                      render={({ field: { value, onChange } }) => (
                        <Select
                          className="text-sm"
                          placeholder="Search City..."
                          isClearable
                          options={cityOptions}
                          value={value ? { value, label: value } : null}
                          onChange={(opt) =>
                            onChange(opt ? (opt as any).value : "")
                          }
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor: "#4568824d",
                              borderRadius: "0.75rem",
                              minHeight: "32px",
                            }),
                          }}
                        />
                      )}
                    />
                  </div>
                ) : (
                  <span>{profileData?.userLocation || "Location not set"}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  },
);

ProfileHeader.displayName = "ProfileHeader";
export default ProfileHeader;
