interface Teacher {
    _id: string;
    name: string;
    title: string;
    bio?: string;
    profilePic?: string;
    jobTitle?: string;
    languages: string[];
    innovativeLearning: string[];
    classes: string[];
    experience?: {
        year: string;
        position: string;
        company: string;
        description: string;
    }[];
    qualifications?: {
        year: string;
        degree: string;
        institution: string;
    }[];
    availability: Availability[];
    subjects?: string[];
    location?: string;
    contact: {
        email: string;
        phone: string;
        website?: string;
    };
    experienceYears: number;
    rating?: number;
    isAvailable?: boolean;
    monthlyFee: number;
    classesPerWeek: number;
}

interface Education {
    year: string;
    degree: string;
    institution: string;
}

interface Experience {
    year: string;
    position: string;
    company: string;
    description: string;
}

interface Classes {

}

export interface Availability {
    day: string;  // Day of the week
    start?: string; // Start time
    end?: string;   // End time
}

export default Teacher;

export type { Experience, Education };
