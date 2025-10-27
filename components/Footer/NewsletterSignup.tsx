'use client';
import { supabase } from '@/supabaseClient';
import { useTranslations } from 'next-intl';
import React, { FC, FormEvent } from 'react';
import { FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';

const NewsletterSignup: FC = () => {
  const t = useTranslations('common');

  const [email, setEmail] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const onChangeHandler = (val: string) => setEmail(val);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (email) {
      try {
        const { data, error } = await supabase
          .from('Newsletter')
          .insert([{ email }])
          .select();

        if (data) {
          toast.success('Email has been recorded!');
          setEmail('');
        }
        if (error) throw error;
      } catch (error: any) {
        toast.error(error.message);
      }
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={submitHandler}
      className="
        bg-[#F8F5F0]
        w-full
        h-[48px] md:h-[55px]
        md:w-[296px]
        rounded-[10px] md:rounded-[5px]
        flex justify-between items-center p-2
      "
    >
      <input
        required
        type="email"
        onChange={(e) => onChangeHandler(e.target.value)}
        value={email}
        placeholder={t('footer_email_input_placeholder')}
        className="
          placeholder:text-[14px] placeholder:text-[#A2A9B0]
          text-[16px] text-[#000000] bg-transparent
          outline-none border-none focus:outline-none focus:ring-0
          w-full pr-2
        "
      />

      <button
        disabled={loading}
        type="submit"
        className="
          rounded-full aspect-square
          bg-[#C1001F] text-white text-[18px]
          w-[40px] h-[40px] flex justify-center items-center
          disabled:bg-gray-500 transition
        "
      >
        <FiSend size={18} />
      </button>
    </form>
  );
};

export default NewsletterSignup;
