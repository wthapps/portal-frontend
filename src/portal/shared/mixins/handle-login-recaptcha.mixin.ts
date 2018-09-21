export class HandleReCaptchaMixin {
  notRobot: boolean = false;
  handleCaptcha(event: any) {
    document.getElementById('notRobot').click();
  }
}
