import { VERIFICATION_TOKEN_EXP_MIN } from "../constants";

interface WelcomeEmailProps {
  companyName: string;
  token: string;
  productionUrl: string;
}

export const getWelcomeEmailHTML = ({
  companyName,
  token,
  productionUrl,
}: WelcomeEmailProps) => {
  return `
     <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="text-align: center; color: #3b82f6;">Authy</h2>

          
    
          <p>${companyName}</p>
          <p>
          Welcome to Antlias! We’re thrilled to have you on board. With Antlias, you can now manage your fuel inventory, schedule deliveries, and monitor consumption with ease.
          </p>
    
          <p>Please use the link below to verify your email address and continue on AnTlias. This link will expire in ${VERIFICATION_TOKEN_EXP_MIN} minutes.</p>
    
          <p style="text-align: center;">
            <a href="${productionUrl}auth/sign-up/verify-email?token=${token}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #3b82f6; text-decoration: none; border-radius: 5px;">Verify Email</a>
          </p>
          
          <br />
    
          <p>Here’s to smoother operations and smarter fuel management!</p>
          <p>Best regards, </p>
          <p>Antlias team </p>
    
          <p style="text-align: center; font-size: 12px; color: #aaa;">This email was sent to info@antlias.com. If you'd rather not receive this kind of email, Don’t want any more emails from Antlias? Unsubscribe.</p>
        </div>
  `;
};
