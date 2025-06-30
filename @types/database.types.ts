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
    };
  };
}

export type TableRow<
  T extends keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][T]["Row"];