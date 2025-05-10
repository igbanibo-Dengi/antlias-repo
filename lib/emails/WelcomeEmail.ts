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

      <div style="text-align: center; margin-bottom: 20px; display: flex; gap: 10px; justify-content: start; align-items: center; height: 100px;">
    <img src="https://3cjfd0cjxo.ufs.sh/f/UgVdr0oJWLNbv0aLn34ZuMrWBxjLOkJXzZE0GDU1htdwAgKH" alt="Antlias Logo" style="width: 28px; height: 28px;" />
        <h1 style="font-size: 28px; font-weight: bold; color: #0066cc; margin: 0;">Antlias</h1>
      </div>

      <h2 style="text-align: left; font-size: 24px; font-weight: bold;">Welcome to Antlias</h2>

      <p style="margin: 20px 0;"><strong>${companyName}</strong></p>

      <p style="margin: 20px 0;">
       Welcome to Antlias! We’re thrilled to have you on board. With Antlias, you can now manage your fuel inventory, schedule deliveries, and monitor consumption with ease.
      </p>

      <p style="margin: 20px 0;">
        Please use the link below to verify your email address and continue on Antlias. This link will expire in <strong>${VERIFICATION_TOKEN_EXP_MIN}</strong> minutes.
      </p>

      <p style="text-align: center; margin: 30px 0;">
        <a href="${productionUrl}auth/sign-up/verify-email?token=${token}" 
           style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #fff; background-color: #3A57E8; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Verify Email
        </a>
      </p>

      <p style="margin: 20px 0;">If you have any questions or need assistance, feel free to reach out to our support team at <a href="#" style="color: #3A57E8;">info@antlias.com .</a>. </p>

      <p style="margin: 20px 0;">Here’s to smoother operations and smarter fuel management!</p>
      
      <p>Best regards,</p>
      <p>The Antlias Team</p>

      <p style="text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eaeaea; padding-top: 15px; margin-top: 30px;">
        This email was sent to info@antlias.com.<br />
        Don’t want to receive these emails? <a href="#" style="color: #3A57E8;">Unsubscribe</a>.
      </p>
    </div>
  `;
};
