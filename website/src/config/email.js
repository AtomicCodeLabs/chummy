import { send } from 'emailjs-com';

const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const USER_ID = process.env.EMAILJS_USER_ID;

// https://www.emailjs.com/docs/sdk/installation/
const sendEmail = async (parameters) => {
  try {
    const success = await send(SERVICE_ID, TEMPLATE_ID, parameters, USER_ID);
    return success;
  } catch (error) {
    console.error('Could not send request');
    return error;
  }
};

export default sendEmail;
