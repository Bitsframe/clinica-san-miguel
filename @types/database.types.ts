export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      About_Short: {
        Row: {
          // the data expected from .select()
          id: number;
          created_at: string;
          content: string | null;
        };
      };

      // Special pictures used on the Specials page
      special_picture: {
        Row: {
          id: number;
          file_path: string;
          display: boolean;
          created_at: string;
          title: string | null;
        };
      };
      About_Short_es: {
        Row: {
          // the data expected from .select()
          id: number;
          created_at: string;
          content: string | null;
        };
      };
      about: {
        Row: {
          // the data expected from .select()
          id: number;
          created_at: string;
          text_1: string | null;
          title_1: string | null;
          image_1: string | null;
          text_2: string | null;
          title_2: string | null;
          image_2: string | null;
          text_3: string | null;
          title_3: string | null;
          image_3: string | null;
          text_4: string | null;
          title_4: string | null;
          image_4: string | null;
          text_5: string | null;
          title_5: string | null;
          image_5: string | null;
        };
      };
      about_es: {
        Row: {
          // the data expected from .select()
          id: number;
          created_at: string;
          text_1: string | null;
          title_1: string | null;
          image_1: string | null;
          text_2: string | null;
          title_2: string | null;
          image_2: string | null;
          text_3: string | null;
          title_3: string | null;
          image_3: string | null;
          text_4: string | null;
          title_4: string | null;
          image_4: string | null;
          text_5: string | null;
          title_5: string | null;
          image_5: string | null;
        };
      };
      Mission: {
        Row: {
          // the data expected from .select()
          id: number;
          created_at: string;
          Icon: string | null;
          Title: string | null;
          Text: string | null;
        };
      };
      Mission_es: {
        Row: {
          // the data expected from .select()
          id: number;
          created_at: string;
          Icon: string | null;
          Title: string | null;
          Text: string | null;
        };
      };
      Additional_Services: {
        Row: {
          // the data expected from .select()
          id: number;
          created_at: string;
          title: string | null;
          image: string | null;
          content: string | null;
        };
      };
      Blog: {
        Row: {
          // the data expected from .select()
          id: number;
          created_at: string;
          title: string | null;
          image: string | null;
          content: string | null;
        };
      };
      FAQs: {
        Row: {
          // the data expected from .select()
          id: number;
          created_at: string;
          question: string | null;
          answer: string | null;
        };
      };
      FAQs_es: {
        Row: {
          // the data expected from .select()
          id: number;
          created_at: string;
          question: string | null;
          answer: string | null;
        };
      };
      Hero_Section: {
        Row: {
          // the data expected from .select()
          id: number;
          created_at: string;
          title: string | null;
          content: string | null;
        };
      };
      Hero_Section_es: {
        Row: {
          // the data expected from .select()
          id: number;
          created_at: string;
          title: string | null;
          content: string | null;
        };
      };
      Locations: {
        Row: {
          // the data expected from .select()
          id: number;
          title: string | null;
          email: string | null;
          created_at: string;
          phone: string | null;
          mon_timing: string | null;
          tuesday_timing: string | null;
          wednesday_timing: string | null;
          thursday_timing: string | null;
          friday_timing: string | null;
          saturday_timing: string | null;
          sunday_timing: string | null;
          direction: string | null;
          address: string | null;
        };
      };
      Images: {
        Row: {
          // the data expected from .select()
          id: number;
          created_at: string;
          location_id: number | null;
          image: string | null;
        };
      };
      services: {
        Row: {
          // the data expected from .select()
          id: number;
          created_at: string;
          title: string | null;
          image: string | null;
          description: string | null;
          icon: string | null;
        };
      };
      services_es: {
        Row: {
          // the data expected from .select()
          id: number;
          created_at: string;
          title: string | null;
          image: string | null;
          description: string | null;
          icon: string | null;
        };
      };
      Specials: {
        Row: {
          // the data expected from .select()
          id: number;
          created_at: string;
          image: string | null;
        };
      };
      Testinomial: {
        Row: {
          rating: number;
          // the data expected from .select()
          id: number;
          created_at: string;
          name: string | null;
          stars: string | null;
          review: string | null;
        };
      };
      career: {
        Row: {
          // the data expected from .select()
          id: number;
          created_at: string;
          Text: string | null;
        };
      };
      career_es: {
        Row: {
          // the data expected from .select()
          id: number;
          created_at: string;
          Text: string | null;
        };
      };

      allpatients: {
        Row: {
          id: number;
          created_at: string;
          firstname: string | null;
          lastname: string | null;
          email: string | null;
          phone: string | null;
          onsite: boolean | null;
        };
      };

      Appoinments: {
        Row: {
          // the data expected from .select()
          id: number;
          created_at: string;
          texts: string | null;
          location_id: number | null;
          first_name: string | null;
          last_name: string | null;
          email_address: string | null;
          in_office_patient: boolean | null;
          new_patient: boolean | null;
          dob: string | null;
          sex: string | null;
          service: string | null;
        };
      };
      intake_form: {
        Row: {
          id: number;
          created_at: string;
          appointment_id: number | null;
          chief_complaint: string | null;
          location: string | null;
          severity: number | null;
          symptoms_description: string | null;
          medical_conditions: string[] | null;
          surgeries: string[] | null;
          allergies: string[] | null;
          current_medications: string[] | null;
          fh_diabetes: boolean | null;
          fh_hypertension: boolean | null;
          fh_cancer: boolean | null;
          fh_heart_disease: boolean | null;
          tobacco_use: string | null;
          alcohol_use: string | null;
          drug_use: string | null;
          occupation: string | null;
          onset: string | null;
          relieving_factors: string[] | null;
          cancer_type: string | null;
          number_of_pregnancies: number | null;
          birth_control_status: string | null;
          last_pap_smear: Json | null;
          last_mammogram: Json | null;
          last_prostate_exam: Json | null;
        };
      };
      features: {
        Row: {
          id: number; 
          created_at: string; 
          title: string | null; 
          description: string | null; 
          icon: string | null; 
        };
      };

      features_es: {
          Row: {
            id: number; 
            created_at: string; 
            title: string | null; 
            description: string | null; 
            icon: string | null; 
          };
        };

        allservices: {
  Row: {
    id: number;
    title: string;
    about_content: string | null;
    subheading: string | null;
    sub_content: any | null; // assuming JSON object or array
    question_answers: any | null; // typically array of Q&A objects
    faqs: any | null; // typically array of { question, answer } objects
    end_tagline: string | null;
    note: string | null;
    image_url: string | null;
  };
};

allservices_es: {
  Row: {
    id: number;
    title: string;
    about_content: string | null;
    subheading: string | null;
    sub_content: any | null; // assuming JSON object or array
    question_answers: any | null; // typically array of Q&A objects
    faqs: any | null; // typically array of { question, answer } objects
    end_tagline: string | null;
    note: string | null;
    image_url: string | null;
  };
};

      feedback: {
        Row: {
          id: number;
          created_at: string;
          rating: number;
          feedback_text: string | null;
          order_id: string | null;
          patient_id: number | null;
        };
      };

      orders: {
        Row: {
          id: number;
          created_at: string;
          order_id: string | null;
          patient_id: number | null;
        };
      };

        
    };
  };
}

export type TableRow<
  T extends keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][T]["Row"];