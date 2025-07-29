interface Teacher {
  _id: string;
  name: string;
  isActive: boolean;
  isPremium: boolean;
  title: string;
  bio: string;
  profilePic: string;
  jobTitle: string;
  languages: string[];
  innovativeLearning: string[];
  classes: string[];
  experience: {
    year: string;
    position: string;
    company: string;
    description: string;
  }[];
  qualifications: {
    year: string;
    degree: string;
    institute: string;
  }[];
  availability: Availability[];
  subjects: string[];
  location: string;
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
  institute: string; // change 'institution' to 'institute'
}


interface Experience {
  year: string;
  position: string;
  company: string;
  description: string;
}

interface Availability {
  day: string;
  start: string; // Format: "HH:MM"
  end: string;   // Format: "HH:MM"
}

export default Teacher;

export type { Experience, Education, Availability };
