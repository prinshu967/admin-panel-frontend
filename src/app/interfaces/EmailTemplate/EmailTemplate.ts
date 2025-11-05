export interface emailTemplate {
  id: string;           
  key: string;
  title: string;
  subject: string;
  fromName: string;
  fromEmail: string;   
  isActive: boolean;
  isManualMail: boolean;
  isContactUsMail: boolean;
  body: string;
}
