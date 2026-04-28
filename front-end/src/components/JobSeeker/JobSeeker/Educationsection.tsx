"use client";

import { memo, useRef, useState, useCallback } from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "sonner";
import { ProfileFormValues } from "@/src/types";

const EducationItem = memo(
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
    const isCurrent = watch(`education.${index}.current`);

    if (!editing) {
      return (
        <div className="group border-l-4 border-amber-400 pl-6 py-1 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <h4 className="text-xl font-bold text-[#234C6A]">{field.degree}</h4>
            <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-bold">
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
            </span>
          </div>
          <p className="text-lg font-medium text-[#456882] italic mt-1">
            {field.institution}
          </p>
        </div>
      );
    }

    return (
      <div className="group border-l-4 border-amber-400 pl-6 py-1 relative">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute -right-2 top-0 p-2 text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-5 w-5" />
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...register(`education.${index}.degree`)}
            placeholder="Degree/Certificate"
            className="font-bold border-[#456882]/30"
          />
          <Input
            {...register(`education.${index}.institution`)}
            placeholder="School/University"
            className="border-[#456882]/30"
          />
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register(`education.${index}.current`)}
                id={`edu-current-${field.id}`}
                className="rounded border-[#234C6A] text-[#234C6A]"
              />
              <label
                htmlFor={`edu-current-${field.id}`}
                className="text-sm font-medium text-[#456882]"
              >
                I am still studying here
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={control}
                name={`education.${index}.startDate`}
                render={({ field: f }) => (
                  <DatePicker
                    selected={f.value ? new Date(f.value) : null}
                    onChange={(date: Date | null) => f.onChange(date?.toISOString())}
                    placeholderText="Start Date"
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    className="flex h-10 w-full rounded-md border border-[#456882]/30 bg-background px-3 py-2 text-sm"
                  />
                )}
              />
              <Controller
                control={control}
                name={`education.${index}.endDate`}
                render={({ field: f }) => (
                  <DatePicker
                    selected={f.value ? new Date(f.value) : null}
                    onChange={(date: Date | null) => f.onChange(date?.toISOString())}
                    placeholderText="End Date"
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    disabled={isCurrent}
                    className="flex h-10 w-full rounded-md border border-[#456882]/30 bg-background px-3 py-2 text-sm disabled:opacity-50"
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);

EducationItem.displayName = "EducationItem";

const AddEducationForm = memo(({ onAdd }: { onAdd: (edu: any) => void }) => {
  const [current, setCurrent] = useState(false);
  const degreeRef = useRef<HTMLInputElement>(null);
  const instRef = useRef<HTMLInputElement>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleAdd = useCallback(() => {
    const institution = instRef.current?.value?.trim();
    const degree = degreeRef.current?.value?.trim();
    if (!institution || !degree) {
      toast.error("Please fill in school and degree");
      return;
    }
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      institution,
      degree,
      startDate: startDate?.toISOString() || "",
      endDate: current ? "" : endDate?.toISOString() || "",
      current,
    });
    if (instRef.current) instRef.current.value = "";
    if (degreeRef.current) degreeRef.current.value = "";
    setStartDate(null);
    setEndDate(null);
    setCurrent(false);
  }, [startDate, endDate, current, onAdd]);

  return (
    <div className="mt-10 p-6 bg-amber-50/30 rounded-2xl border-2 border-dashed border-amber-200">
      <h4 className="text-lg font-bold text-[#234C6A] mb-6 flex items-center gap-2">
        <Plus className="h-5 w-5" /> Add New Education
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          ref={degreeRef}
          placeholder="Degree (e.g. B.S. Computer Science)"
          className="border-[#456882]/30"
        />
        <Input
          ref={instRef}
          placeholder="School/University"
          className="border-[#456882]/30"
        />
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={current}
              onChange={(e) => setCurrent(e.target.checked)}
              id="new-edu-current"
              className="rounded border-[#234C6A] text-[#234C6A]"
            />
            <label
              htmlFor="new-edu-current"
              className="text-sm font-medium text-[#456882]"
            >
              Still studying here
            </label>
          </div>
          <div className="flex items-center gap-2">
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              placeholderText="Start Date"
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className="flex h-10 w-full rounded-md border border-[#456882]/30 bg-background px-3 py-2 text-sm"
            />
            <span className="text-[#456882]">-</span>
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              placeholderText="End Date"
              dateFormat="MM/yyyy"
              showMonthYearPicker
              disabled={current}
              className="flex h-10 w-full rounded-md border border-[#456882]/30 bg-background px-3 py-2 text-sm disabled:opacity-50"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <Button
            type="button"
            onClick={handleAdd}
            className="bg-amber-500 hover:bg-amber-600 rounded-xl px-8"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Education
          </Button>
        </div>
      </div>
    </div>
  );
});

AddEducationForm.displayName = "AddEducationForm";

const EducationSection = memo(({ editing }: { editing: boolean }) => {
  const { control } = useFormContext<ProfileFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  const handleRemove = useCallback((index: number) => remove(index), [remove]);
  const handleAdd = useCallback((edu: any) => append(edu), [append]);

  return (
    <Card className="p-8 border-[#456882]/30 bg-white shadow-lg rounded-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[#234C6A]/10 rounded-xl">
          <GraduationCap className="h-5 w-5 text-[#234C6A]" />
        </div>
        <h3 className="text-xl font-bold text-[#234C6A]">Education</h3>
      </div>

      <div className="space-y-8">
        {fields.map((field, index) => (
          <EducationItem
            key={field.id}
            field={field}
            index={index}
            editing={editing}
            onRemove={handleRemove}
          />
        ))}

        {editing && <AddEducationForm onAdd={handleAdd} />}

        {!editing && fields.length === 0 && (
          <p className="text-[#456882] italic text-center py-6 bg-gray-50 rounded-xl">
            No education added yet.
          </p>
        )}
      </div>
    </Card>
  );
});

EducationSection.displayName = "EducationSection";
export default EducationSection;
