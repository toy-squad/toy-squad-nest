export class SendEmailRequestDto {
  to: string; // 이메일 받는사람
  from: string; // 이메일 보내는사람
  subject: string; // 이메일 제목
  text: string; // 이메일 텍스트 내용
  html: string; // HTML Body 내용
}
