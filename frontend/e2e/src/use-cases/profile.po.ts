import { AppPage } from '../app-page.po';
import { browser } from 'protractor';

export class ProfileUseCases {
  constructor(private page: AppPage) {
  }

  displayProfileScreen() {
    expect(this.page.getElements('app-profile').count()).toEqual(1);
    expect(this.page.getElements('#enroll_self').count()).toEqual(1);
    expect(this.page.getElements('#enroll_guardian').count()).toEqual(1);
    expect(this.page.getElements('#enroll_professional').count()).toEqual(1);
  }

  startGuardianFlow() {
    const pattern = /\/flow\/guardian_intake\/([0-9]+)/;
    this.page.clickAndExpectRoute('#enroll_guardian', pattern);
  }

  navigateToProfile() {
    this.page.clickAndExpectRoute('#profile-button', '/profile');
  }

  async displayAvatars() {
    expect(this.page.getElements('[id^=participant_').count()).toBeGreaterThan(0);
    const btnEls = await this.page.getElements('[id^=participant_');
    for (const btnEl of btnEls) {
      const btnId: string = await btnEl.getAttribute('id');
      const participantId = btnId.replace('participant_', '');
      expect(this.page.getElements('#participant_' + participantId).count()).toEqual(1);
    }
  }

  async displayAvatarDialog() {
    const btnEl = this.page.getElement('[id^=avatar_');
    const btnId: string = await btnEl.getAttribute('id');
    this.page.clickElement(`#${btnId}`);
    expect(this.page.getElements('app-avatar-dialog').count()).toEqual(1);
  }

  async editAvatarImg() {
    const btnEls = await this.page.getElements('.avatar-image');

    for (let i = 0; i < btnEls.length; i++) {
      const btnEl = btnEls[i];

      if (i < 2) {
        btnEl.click();
        const avImgEl = this.page.getElement('.avatar img');
        const imgEl = this.page.getChildElement('img', btnEl);
        const expectedSrc = await imgEl.getAttribute('src');
        const actualSrc = await avImgEl.getAttribute('src');
        expect(expectedSrc).toEqual(actualSrc);
      }
    }
  }

  async editAvatarColor() {
    const swatchEls = await this.page.getElements('.color-swatch');

    for (let i = 0; i < swatchEls.length; i++) {
      const swatchEl = swatchEls[i];

      if (i < 2) {
        swatchEl.click();
        const avatar = this.page.getElement('.avatar');
        const expectedColor = await swatchEl.getCssValue('background-color');
        const actualColor = await avatar.getCssValue('background-color');
        expect(expectedColor).toEqual(actualColor);
      }
    }
  }

  async saveAvatar() {
    const avatarEl = this.page.getElement('.avatar');
    const avImgEl = this.page.getChildElement('img', avatarEl);
    const expectedColor = await avatarEl.getCssValue('background-color');
    const expectedImg = await avImgEl.getAttribute('src');
    this.page.clickElement('#save_avatar_changes');
    const avatarBtnEl = this.page.getElement('[id^=avatar_');
    const actualColor = await avatarBtnEl.getCssValue('background-color');
    const actualImg = await avatarBtnEl.getAttribute('src');
    expect(expectedColor).toEqual(actualColor);
    expect(expectedImg).toEqual(actualImg);
  }

  async navigateToGuardianFlow() {
    const btnEl = this.page.getElement('[id^=edit_enroll_self_guardian_]');
    const btnId: string = await btnEl.getAttribute('id');
    const participantId = btnId.replace('edit_enroll_self_guardian_', '');
    this.page.clickAndExpectRoute(`#${btnId}`, `/flow/guardian_intake/${participantId}`);
  }
}