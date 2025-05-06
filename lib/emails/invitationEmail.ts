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
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <h2 style="text-align: center; color: #0066cc;">${tenantName}</h2>
      
      <p>Hi ${recipientName},</p>
    
      
      <p>You've been invited to join <strong>${tenantName}</strong> on Antlias.</p>
      
      <h3 style="color: #0066cc; border-bottom: 1px solid #eaeaea; padding-bottom: 8px;">To get started:</h3>
      
      <ol>
        <li>Click below to create your password</li>
        <li>Log in to view your assigned tasks and station details</li>
        <li>This link will expire in ${INVITATION_TOKEN_EXP_DAYS} days.</li>
      </ol>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${config.env.prodApiEndpoint}auth/invitation/accept?token=${token}" 
           style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #fff; background-color: #0066cc; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Create Your Password
        </a>
      </p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #0066cc;">Create your password</h4>
        <p style="margin-bottom: 0;">
          <strong>Note:</strong> Your access is restricted to <em>${stationName}</em> Branch. 
          Contact your Manager or Owner for assistance.
        </p>
      </div>
      
      <p style="text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eaeaea; padding-top: 15px; margin-top: 30px;">
        Best regards,<br />
        The ENYO Retail Team
      </p>
      
      <p style="font-size: 11px; color: #999; text-align: center;">
        This email was sent to ${recipientName}.<br />
        Don't want to receive these emails? <a href="#" style="color: #999;">Unsubscribe</a>.
      </p>
    </div>
  `;
};