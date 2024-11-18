import { ReactNode } from "react";
import { ReactSVG } from "react-svg";
import { Dropdown } from "react-bootstrap";
import { MdLanguage } from "react-icons/md";
import { BiSolidWallet } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { BsBuildingsFill } from "react-icons/bs";
import { FaUserCog, FaUsers } from "react-icons/fa";
import { fontSize, iconStyle, TSection } from "./helpers";
import styles from "../styles.module.scss";

export function MainSection({
  role,
  changeSection,
}: {
  role: string;
  changeSection: (newSection: TSection) => void;
}) {
  const { t, i18n } = useTranslation();
  const changeLanguage = (language: "en" | "ru") => {
    i18n.changeLanguage(language);
  };
  let settingOptions: [ReactNode, TSection, string, string][] = [
    [
      <BsBuildingsFill style={iconStyle} />,
      "company",
      t("settings.myCompany"),
      t("editDetails.details"),
    ],
    [
      <ReactSVG src="assets/svg/person_loop.svg" style={iconStyle} />,
      "security",
      t("settings.securitySectionTitle"),
      t("settings.passwords"),
    ],
    [
      <BiSolidWallet style={iconStyle} />,
      "subscriptions",
      t("subscriptions.plural"),
      "",
    ],
    [<FaUsers style={iconStyle} />, "managers", t("settings.yourManagers"), ""],
    [
      <FaUserCog style={iconStyle} />,
      "addManager",
      t("settings.addManager"),
      "",
    ],
  ];
  if (role === "manager") {
    settingOptions = [
      [
        <ReactSVG src="assets/svg/person_loop.svg" style={iconStyle} />,
        "security",
        t("settings.securitySectionTitle"),
        t("settings.passwords"),
      ],
    ];
  }
  return (
    <>
      {settingOptions.map(([Icon, section, title, description], idx) => (
        <div
          key={idx}
          className={styles.settingOption}
          onClick={() => changeSection(section)}
        >
          {Icon}
          <div
            className="d-flex flex-column text-left"
            style={{ gap: "0.5rem" }}
          >
            <span className={styles.settingOptionTitle}>{title}</span>
            {description && (
              <span className={styles.settingOptionDescription}>
                {description}
              </span>
            )}
          </div>
        </div>
      ))}
      <div className={styles.settingOption}>
        <MdLanguage style={iconStyle} />
        <div className="d-flex flex-column text-left" style={{ gap: "0.5rem" }}>
          <Dropdown>
            <Dropdown.Toggle
              variant="outline"
              style={{ border: "none", padding: 0 }}
            >
              <span className={styles.settingOptionTitle}>
                {t("settings.language")}
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {[
                ["ru", "Русский"],
                ["en", "English"],
              ].map(([lang, langText]) => (
                <Dropdown.Item
                  key={lang}
                  className={i18n.language === lang ? "active" : ""}
                  onClick={() => changeLanguage(lang as "ru" | "en")}
                  style={fontSize}
                >
                  {langText}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </>
  );
}
