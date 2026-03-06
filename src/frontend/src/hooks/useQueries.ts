import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FacultyMember, NewsEvent, Program } from "../backend.d.ts";
import type { NewsEventCategory as BackendNewsEventCategory } from "../backend.d.ts";
import { useActor } from "./useActor";

// Runtime enum values (mirrored from backend.d.ts enum, which is a .d.ts file and cannot be imported as a value)
export const NewsEventCategory = {
  news: "news" as BackendNewsEventCategory,
  event: "event" as BackendNewsEventCategory,
} as const;

export type NewsEventCategoryValue = BackendNewsEventCategory;

// ─── Programs ────────────────────────────────────────────────────────────────

export function useGetActivePrograms() {
  const { actor, isFetching } = useActor();
  return useQuery<Program[]>({
    queryKey: ["programs", "active"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getActivePrograms();
      return result;
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Faculty ─────────────────────────────────────────────────────────────────

export function useGetAllFacultyMembers() {
  const { actor, isFetching } = useActor();
  return useQuery<FacultyMember[]>({
    queryKey: ["faculty", "all"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getAllFacultyMembers();
      return result;
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── News & Events ────────────────────────────────────────────────────────────

export function useGetActiveNewsEvents() {
  const { actor, isFetching } = useActor();
  return useQuery<NewsEvent[]>({
    queryKey: ["news", "active"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getActiveNewsEvents();
      return result;
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Admission Inquiry ────────────────────────────────────────────────────────

export function useSubmitAdmissionInquiry() {
  return useMutation({
    mutationFn: async ({
      actor,
      applicantName,
      email,
      phone,
      programOfInterest,
      academicBackground,
    }: {
      actor: NonNullable<ReturnType<typeof useActor>["actor"]>;
      applicantName: string;
      email: string;
      phone: string;
      programOfInterest: string;
      academicBackground: string;
    }) => {
      await actor.submitAdmissionInquiry(
        applicantName,
        email,
        phone,
        programOfInterest,
        academicBackground,
      );
    },
  });
}

// ─── Contact Form ─────────────────────────────────────────────────────────────

export function useSubmitContactForm() {
  return useMutation({
    mutationFn: async ({
      actor,
      name,
      email,
      phone,
      message,
    }: {
      actor: NonNullable<ReturnType<typeof useActor>["actor"]>;
      name: string;
      email: string;
      phone: string;
      message: string;
    }) => {
      await actor.submitContactForm(name, email, phone, message);
    },
  });
}

// ─── Seed Data Helpers ────────────────────────────────────────────────────────

export function useAddProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      actor,
      name,
      duration,
      description,
      eligibility,
    }: {
      actor: NonNullable<ReturnType<typeof useActor>["actor"]>;
      name: string;
      duration: string;
      description: string;
      eligibility: string;
    }) => {
      await actor.addProgram(name, duration, description, eligibility, true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
}

export function useAddFacultyMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      actor,
      name,
      designation,
      qualification,
      department,
      bio,
    }: {
      actor: NonNullable<ReturnType<typeof useActor>["actor"]>;
      name: string;
      designation: string;
      qualification: string;
      department: string;
      bio: string;
    }) => {
      await actor.addFacultyMember(
        name,
        designation,
        qualification,
        department,
        bio,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculty"] });
    },
  });
}

export function useAddNewsEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      actor,
      title,
      description,
      category,
    }: {
      actor: NonNullable<ReturnType<typeof useActor>["actor"]>;
      title: string;
      description: string;
      category: BackendNewsEventCategory;
    }) => {
      await actor.addNewsEvent(title, description, category, true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
}
