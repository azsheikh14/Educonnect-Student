interface Teacher {
    id: any;
    _id: string;
    name: string;
    title: string;
    bio?: string;
    profilePic?: string;
    jobTitle?: string;
    languages: string[];
    innovativeLearning: string[]
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
    availability?: string;
    subjects?: string[];
    location?: string;
    contact: {
        email: string;
        phone: string;
        website?: string;
    };
    experienceYears:number;
    rating?: number; // Add rating
    isAvailable?: boolean; // Add availability
}

export default Teacher;
