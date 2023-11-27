const baseUrl = "http://localhost:80";
const assetsPath = baseUrl + "/assets/";
const iconsPath = assetsPath + "icons/";

const config = {
  apiUrl: "http://localhost:80/api",
  assets: {
    logo: assetsPath + "logo.png",
    logoWithText: assetsPath + "logo-with-text.png",
    avatarPlaceholder: assetsPath + "avatar-placeholder.png",
    icons: {
      add: iconsPath + "add-icon.svg",
      arrowLeft: iconsPath + "arrow-left-icon.svg",
      back: iconsPath + "back-icon.svg",
      checkBold: iconsPath + "check-circle-bold.svg",
      closeBold: iconsPath + "close-circle-bold.svg",
      closeSquareBold: iconsPath + "close-square-bold.svg",
      closeSquareThin: iconsPath + "close-square-thin.svg",
      informationFill: iconsPath + "information-fill.svg",
      magnifier: iconsPath + "magnifier.svg",
      check: iconsPath + "check.svg",
      cross: iconsPath + "cross.svg",
    },
  },
};

export default config;
