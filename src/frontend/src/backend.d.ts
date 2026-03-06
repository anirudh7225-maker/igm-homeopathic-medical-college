import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Program {
    id: bigint;
    duration: string;
    name: string;
    description: string;
    isActive: boolean;
    eligibility: string;
}
export interface FacultyMember {
    id: bigint;
    bio: string;
    name: string;
    designation: string;
    department: string;
    qualification: string;
}
export type Timestamp = bigint;
export interface NewsEvent {
    id: bigint;
    title: string;
    date: Timestamp;
    description: string;
    isActive: boolean;
    category: NewsEventCategory;
}
export enum NewsEventCategory {
    news = "news",
    event = "event"
}
export interface backendInterface {
    addFacultyMember(name: string, designation: string, qualification: string, department: string, bio: string): Promise<void>;
    addNewsEvent(title: string, description: string, category: NewsEventCategory, isActive: boolean): Promise<void>;
    addProgram(name: string, duration: string, description: string, eligibility: string, isActive: boolean): Promise<void>;
    getActiveNewsEvents(): Promise<Array<NewsEvent>>;
    getActivePrograms(): Promise<Array<Program>>;
    getAllFacultyMembers(): Promise<Array<FacultyMember>>;
    getAllNewsEvents(): Promise<Array<NewsEvent>>;
    getAllPrograms(): Promise<Array<Program>>;
    getFacultyMember(id: bigint): Promise<FacultyMember>;
    getNewsEvent(id: bigint): Promise<NewsEvent>;
    getProgram(id: bigint): Promise<Program>;
    removeFacultyMember(id: bigint): Promise<void>;
    removeNewsEvent(id: bigint): Promise<void>;
    removeProgram(id: bigint): Promise<void>;
    submitAdmissionInquiry(applicantName: string, email: string, phone: string, programOfInterest: string, academicBackground: string): Promise<void>;
    submitContactForm(name: string, email: string, phone: string, message: string): Promise<void>;
    updateFacultyMember(id: bigint, name: string, designation: string, qualification: string, department: string, bio: string): Promise<void>;
    updateNewsEvent(id: bigint, title: string, description: string, category: NewsEventCategory, isActive: boolean): Promise<void>;
    updateProgram(id: bigint, name: string, duration: string, description: string, eligibility: string, isActive: boolean): Promise<void>;
}
