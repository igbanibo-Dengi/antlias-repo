import config from "../config";
import { INVITATION_TOKEN_EXP_DAYS } from "../constants";

interface InvitationEmailProps {
  recipientName: string;
  tenantName: string;
  stationName: string;
  token: string;
}

export const sendStationInvitationEmail = ({
  recipientName,
  tenantName,
  stationName,
  token,
}: InvitationEmailProps) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 10px;">

      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 32px;">
        <img src="https://3cjfd0cjxo.ufs.sh/f/UgVdr0oJWLNbv0aLn34ZuMrWBxjLOkJXzZE0GDU1htdwAgKH" alt="Antlias Logo" style="width: 28px; height: 28px;" />
        <h1 style="font-size: 28px; font-weight: bold; color: #0066cc; margin: 0;">Antlias</h1>
      </div>

      <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 16px;">You have been Invited</h2>

      <p style="margin: 16px 0;">Hi ${recipientName},</p>

      <p style="margin: 16px 0;">
        You've been invited to join <strong>${tenantName}</strong> on Antlias.
      </p>

      <h3 style="font-size: 18px; color: #0066cc; margin: 24px 0 12px;">To get started:</h3>

      <ol style="padding-left: 20px; margin: 0 0 24px 0;">
        <li style="margin-bottom: 8px;">Click below to create your password.</li>
        <li>This link will expire in ${INVITATION_TOKEN_EXP_DAYS} days.</li>
      </ol>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${config.env.prodApiEndpoint}auth/invitation/accept?token=${token}"
           style="display: inline-block; padding: 14px 28px; font-size: 16px; color: #fff; background-color: #3A57E8; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Create Your Password
        </a>
      </div>

      <div style="margin: 24px 0;">
        <p style="margin: 0;">
          <strong>Note:</strong> Your access is restricted to <em>${stationName}</em> Branch. 
          Contact your Manager or Owner for assistance.
        </p>
      </div>

      <div style="border-top: 1px solid #eaeaea; padding-top: 20px; margin-top: 40px; text-align: center; font-size: 13px; color: #999;">
        <p style="margin-bottom: 8px;">Best regards,<br />The Antlias Team</p>
        <p style="font-size: 11px; margin: 0;">
          This email was sent to ${recipientName}.<br />
          Don’t want to receive these emails? <a href="#" style="color: #3A57E8;">Unsubscribe</a>.
        </p>
      </div>

    </div>
  `;
};
