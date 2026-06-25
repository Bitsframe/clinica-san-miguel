import { toast } from "react-toastify";

interface DataInterface {
    email: string;
    phone: string;
    state?: string;
    zipcode?: string;
    street_address?: string;
}

export const validateFormData = (data: DataInterface, address = false) => {
    const { email, phone, state, zipcode, street_address } = data

    if (email) {
        const isValidEmail = String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );

        if (!isValidEmail) {
            toast.error(`Please enter a valid email`);
            return false
        }
    }
    // Phone: no format validation — UI mask limits to 10 digits
    if (address) {
        if (zipcode) {
            const isValidZipCode = String(zipcode)
                .match(/^[0-9]{5}(?:-[0-9]{4})?$/);
            if (!isValidZipCode) {
                toast.error(`Please enter a valid Zipcode`);
                return false
            }
        }
    }


    return true


}