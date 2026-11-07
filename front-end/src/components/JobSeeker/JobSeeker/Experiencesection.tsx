"use client";

import { memo, useRef, useState, useCallback } from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Briefcase, Plus, Trash2, Clock } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "sonner";
import { ProfileFormValues } from "@/src/types";

interface ExperienceSectionProps {
  editing: boolean;
}

// Single experience item — isolated re-renders
const ExperienceItem = memo(
  ({
    field,
    index,
    editing,
    onRemove,
  }: {
    field: any;
    index: number;
    editing: boolean;
    onRemove: (index: number) => void;
  }) => {
    const { register, control, watch } = useFormContext<ProfileFormValues>();
    const isCurrent = watch(`experience.${index}.current`);

    if (!editing) {
      return (
        <div className="group border-l-4 border-[#163B5C] pl-6 py-1 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <h4 className="text-xl font-bold text-[#163B5C]">{field.title}</h4>
            <div className="flex items-center gap-2 px-3 py-1 bg-[#163B5C]/5 rounded-full text-sm font-semibold text-[#516C83]">
              <Clock className="h-3.5 w-3.5" />
              {field.startDate
                ? new Date(field.startDate).toLocaleDateString(undefined, {
                    month: "short",
                    year: "numeric",
                  })
                : ""}{" "}
              -{" "}
              {field.current
                ? "Present"
                : field.endDate
                  ? new Date(field.endDate).toLocaleDateString(undefined, {
                      month: "short",
                      year: "numeric",
                    })
                  : ""}
            </div>
          </div>
          <p className="text-lg font-semibold text-[#516C83] flex items-center gap-2 mt-1">
            <Briefcase className="h-4 w-4" /> {field.company}
          </p>
          {field.description && (
            <p className="text-[#163B5C]/80 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100 mt-2">
              {field.description}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="group border-l-4 border-[#163B5C] pl-6 py-1 relative">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute -right-2 top-0 p-2 text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-5 w-5" />
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Input
              {...register(`experience.${index}.title`)}
              placeholder="Job Title"
              className="font-bold text-[#163B5C] border-[#516C83]/30 focus:border-[#163B5C]"
            />
            <Input
              {...register(`experience.${index}.company`)}
              placeholder="Company"
              className="border-[#516C83]/30 focus:border-[#163B5C]"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Controller
                control={control}
                name={`experience.${index}.startDate`}
                render={({ field: f }) => (
                  <DatePicker
                    selected={f.value ? new Date(f.value) : null}
                    onChange={(date: Date | null) => f.onChange(date?.toISOString())}
                    placeholderText="Start Date"
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    className="flex h-10 w-full rounded-md border border-[#516C83]/30 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#163B5C]"
                  />
                )}
              />
              <span className="text-[#516C83]">-</span>
              <Controller
                control={control}
                name={`experience.${index}.endDate`}
                render={({ field: f }) => (
                  <DatePicker
                    selected={f.value ? new Date(f.value) : null}
                    onChange={(date: Date | null) => f.onChange(date?.toISOString())}
                    placeholderText="End Date"
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    disabled={isCurrent}
                    className="flex h-10 w-full rounded-md border border-[#516C83]/30 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#163B5C] disabled:opacity-50"
                  />
                )}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register(`experience.${index}.current`)}
                id={`current-${field.id}`}
                className="rounded border-[#163B5C] text-[#163B5C] focus:ring-[#163B5C]"
              />
              <label
                htmlFor={`current-${field.id}`}
                className="text-sm font-medium text-[#516C83]"
              >
                I am currently working here
              </label>
            </div>
          </div>
          <div className="md:col-span-2">
            <textarea
              {...register(`experience.${index}.description`)}
              placeholder="Describe your achievements and responsibilities..."
              className="w-full p-4 border border-[#516C83]/30 rounded-xl focus:ring-[#163B5C] bg-gray-50 min-h-[100px]"
            />
          </div>
        </div>
      </div>
    );
  },
);

ExperienceItem.displayName = "ExperienceItem";

// Add experience form — fully uncontrolled refs, zero RHF overhead
const AddExperienceForm = memo(({ onAdd }: { onAdd: (exp: any) => void }) => {
  const [current, setCurrent] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleAdd = useCallback(() => {
    const title = titleRef.current?.value?.trim();
    const company = companyRef.current?.value?.trim();
    if (!title || !company) {
      toast.error("Please fill in at least company and position");
      return;
    }
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      title,
      company,
      startDate: startDate?.toISOString() || "",
      endDate: current ? "" : endDate?.toISOString() || "",
      current,
      description: descRef.current?.value || "",
    });
    // Reset
    if (titleRef.current) titleRef.current.value = "";
    if (companyRef.current) companyRef.current.value = "";
    if (descRef.current) descRef.current.value = "";
    setStartDate(null);
    setEndDate(null);
    setCurrent(false);
  }, [startDate, endDate, current, onAdd]);

  return (
    <div className="mt-10 p-6 bg-[#E1E8EF]/30 rounded-2xl border-2 border-dashed border-[#516C83]/30">
      <h4 className="text-lg font-bold text-[#163B5C] mb-6 flex items-center gap-2">
        <Plus className="h-5 w-5" /> Add New Experience
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          ref={titleRef}
          placeholder="Job Title"
          className="border-[#516C83]/30"
        />
        <Input
          ref={companyRef}
          placeholder="Company Name"
          className="border-[#516C83]/30"
        />
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={current}
              onChange={(e) => setCurrent(e.target.checked)}
              id="new-exp-current"
              className="rounded border-[#163B5C] text-[#163B5C]"
            />
            <label
              htmlFor="new-exp-current"
              className="text-sm font-medium text-[#516C83]"
            >
              Currently working here
            </label>
          </div>
          <div className="flex items-center gap-2">
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              placeholderText="Start Date"
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className="flex h-10 w-full rounded-md border border-[#516C83]/30 bg-background px-3 py-2 text-sm"
            />
            <span className="text-[#516C83]">-</span>
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              placeholderText="End Date"
              dateFormat="MM/yyyy"
              showMonthYearPicker
              disabled={current}
              className="flex h-10 w-full rounded-md border border-[#516C83]/30 bg-background px-3 py-2 text-sm disabled:opacity-50"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <textarea
            ref={descRef}
            placeholder="Describe your achievements and responsibilities..."
            className="w-full p-4 border border-[#516C83]/30 rounded-xl bg-gray-50 min-h-[100px]"
          />
        </div>
        <Button
          type="button"
          onClick={handleAdd}
          className="h-12 rounded-2xl bg-[#163B5C] px-8 font-black text-white shadow-xl shadow-[#163B5C]/20 transition-all hover:-translate-y-0.5 hover:bg-[#516C83]"
        >
          <Plus className="h-4 w-4 mr-2" /> Add to Profile
        </Button>
      </div>
    </div>
  );
});

AddExperienceForm.displayName = "AddExperienceForm";

const ExperienceSection = memo(({ editing }: ExperienceSectionProps) => {
  const { control } = useFormContext<ProfileFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  const handleRemove = useCallback((index: number) => remove(index), [remove]);
  const handleAdd = useCallback((exp: any) => append(exp), [append]);

  return (
    <Card className="p-8 border-[#516C83]/30 bg-white shadow-lg rounded-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[#163B5C]/10 rounded-xl">
          <Briefcase className="h-5 w-5 text-[#163B5C]" />
        </div>
        <h3 className="text-xl font-bold text-[#163B5C]">Work Experience</h3>
      </div>

      <div className="space-y-8">
        {fields.map((field, index) => (
          <ExperienceItem
            key={field.id}
            field={field}
            index={index}
            editing={editing}
            onRemove={handleRemove}
          />
        ))}

        {editing && <AddExperienceForm onAdd={handleAdd} />}

        {!editing && fields.length === 0 && (
          <p className="text-[#516C83] italic text-center py-6 bg-gray-50 rounded-xl">
            No work experience added yet.
          </p>
        )}
      </div>
    </Card>
  );
});

ExperienceSection.displayName = "ExperienceSection";
export default ExperienceSection;
