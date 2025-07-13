'use client';
import { useState, useEffect } from 'react';
import StarRating from '@/components/StarRating';
import { Button } from '@/utils';
import { Textarea } from 'flowbite-react';
import { supabase } from '@/supabaseClient';
import { toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation';
import { sendEmail } from '@/utils/emailService';
import { EmailBodyTempEnum } from '@/utils/emailService/templateDetails';
import { useLocale } from 'next-intl';

const initialForm = {
  rating: 0,
  feedback_text: ''
};

const PatientFeedback = () => {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // State to manage fetching
  const [patientDetails, setPatientDetails] = useState<any>(null);
  const route = useRouter();
  const { id } = useParams();
  const locale = useLocale();

  useEffect(() => {
  const fetchOrderDetails = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', id)
        .single();

      if (error) {
        throw error;
      }

      setOrderDetails(data);

      if (data.patient_id) {
        const { data: patientData, error: patientError } = await supabase
          .from('allpatients')
          .select('*')
          .eq('id', data.patient_id)
          .single();

        if (patientError) {
          throw patientError;
        }

        setPatientDetails(patientData);
      }
    } catch (err) {
      setError('Order not found or an error occurred while fetching order details.');
    } finally {
      setFetching(false);
    }
  };

  fetchOrderDetails();
}, [id]);


  // Function to handle input changes
  const onChangeHandle = (key: string, val: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  // Function to clear the form
  const clearFormHandle = () => {
    setFormData({ ...initialForm });
    setError('');
  };

  // Generate a unique promo code
  const generatePromoCode = async () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const prefix = 'FBK';
    let isUnique = false;
    let code = '';
    
    // Keep generating codes until we find a unique one
    while (!isUnique) {
      code = prefix;
      
      for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      
      // Check if this code already exists in the database
      const { data, error } = await supabase
        .from('promocodes')
        .select('id')
        .eq('code', code);
      
      // If no data returned or empty array, the code is unique
      if (!error && (!data || data.length === 0)) {
        isUnique = true;
      }
    }
    
    return code;
  };

  // Function to submit the feedback
  const submitHandle = async () => {
    const { rating, feedback_text } = formData;

    // Check if all fields are filled
    if (rating === 0 || feedback_text.trim() === '') {
      setError('Please provide both rating and feedback.');
      return;
    }

    // Proceed with submission to Supabase
    setError('');
    setLoading(true);
    
    try {
      // 1. Insert feedback
      const postData = {
        rating,
        feedback_text,
        order_id: id,
        patient_id: orderDetails.patient_id
      };

      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .insert([postData])
        .select();

      if (feedbackError) {
        throw feedbackError;
      }

      // 2. Get feedback promocode type id and percentage
      const { data: promoTypeData, error: promoTypeError } = await supabase
        .from('promotype')
        .select('id, percentage')
        .eq('typename', 'Feedback')
        .single();

      if (promoTypeError) {
        throw promoTypeError;
      }

      // Store the percentage for email and redirect
      const discountPercentage = promoTypeData.percentage || 10; // Default to 10% if not set

      // 3. Generate and insert promocode (with guaranteed uniqueness)
      const promoCode = await generatePromoCode();
      const promoData = {
        code: promoCode,
        type: promoTypeData.id,
        assign: orderDetails.patient_id
      };

      const { data: promocodeData, error: promocodeError } = await supabase
        .from('promocodes')
        .insert([promoData])
        .select();

      if (promocodeError) {
        throw promocodeError;
      }

      // 4. Update order with promocode_id
      const { error: orderUpdateError } = await supabase
        .from('orders')
        .update({ promo_code_id: promocodeData[0].id })
        .eq('order_id', id);

      if (orderUpdateError) {
        throw orderUpdateError;
      }

      // 5. Send email with promocode
      if (patientDetails && patientDetails.email) {
        // Fetch location details if needed
        const { data: locationData, error: locationError } = await supabase
          .from('Locations')
          .select('*')
          .eq('id', patientDetails.locationid)
          .single();

        let locationDetails = {
          title: 'Clinica San Miguel',
          address: 'Main Address',
          phone: '1-800-CLINICA'
        };

        if (!locationError && locationData) {
          locationDetails = {
            title: locationData.title || 'Clinica San Miguel',
            address: locationData.address || 'Main Address',
            phone: locationData.phone || '1-800-CLINICA'
          };
        }

        await sendEmail({
          lang: locale as any,
          emailType: EmailBodyTempEnum.FEEDBACK_SUBMISSION_SUCCESS,
          data: {
            email: patientDetails.email,
            name: `${patientDetails.firstname || ''} ${patientDetails.lastname || ''}`.trim(),
            location: locationDetails,
            service: patientDetails.treatmenttype || 'Medical Services',
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            promoCode: promoCode,
            discountPercentage: discountPercentage
          }
        });
      }

      // 6. Show success toast and redirect to home page
      toast.success(`Thank you for your feedback! A ${discountPercentage}% discount code has been sent to your email.`);
      route.push(`/${locale}`);
      clearFormHandle(); // Reset the form
    } catch (err: any) {
      console.error('Error:', err);
      setError('An error occurred while submitting feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loader and error handling in render
  if (fetching) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex justify-center items-center text-red-600">{error}</div>;
  }

  return (
    <div className='min-h-screen flex justify-center items-center'>
      <div className='space-y-5'>
        <div className='text-center text-xl'>
          <h1 className='text-customGray font-bold'>Your feedback is important for us!</h1>
          <p className='text-customGray font-bold'>
            Order no: <span className='text-red-700'>{orderDetails?.order_id}</span> {/* Assuming order_number field */}
          </p>
        </div>

        <div className='space-y-5'>
          <h1>Thank you for visiting Clínica San Miguel! We&apos;d love to hear your feedback to help us improve.</h1>

          {/* Rating Section */}
          <div className='flex items-center space-x-3'>
            <p className='text-lg font-bold text-customGray '>Rating:</p>
            <StarRating
              rating={formData.rating}
              changeRating={(e) => onChangeHandle('rating', e)}
              starDimension='25px'
            />
          </div>

          {/* Feedback Section */}
          <div className='space-y-2'>
            <p className='text-lg font-bold text-customGray '>Feedback:</p>
            <Textarea
              onChange={(e) => onChangeHandle('feedback_text', e.target.value)}
              rows={5}
              placeholder='Type your Feedback here'
              className='bg-transparent'
              value={formData.feedback_text}
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-600">{error}</p>}

          {/* Buttons */}
          <div className='w-full flex justify-end items-center space-x-3'>
            <Button
              text={'Clear'}
              size={{ width: '150px', height: '50px' }}
              bgColor={'#ffffff24'}
              textColor={'#343131'}
              onClick={clearFormHandle}
            />
            <Button
              text={loading ? 'Submitting...' : 'Submit'}
              size={{ width: '150px', height: '50px' }}
              bgColor={'#C1001F'}
              textColor={'#ffffff'}
              onClick={submitHandle}
              disabled={loading} // Disable button while submitting
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientFeedback;
