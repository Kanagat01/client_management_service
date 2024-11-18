import { useState } from "react";
import { FaPen } from "react-icons/fa6";
import { useUnit } from "effector-react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { $mainData, EditUserForm } from "~/entities/User";
import { RoundedGrayButton, RoundedWhiteBox, TitleLg } from "~/shared/ui";
import styles from "./styles.module.scss";

export default function Cabinet() {
  const { t } = useTranslation();
  const mainData = useUnit($mainData);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  return (
    <Row className="w-100">
      <Col md={4}>
        <RoundedWhiteBox className="p-5">
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ height: "4rem" }}
          >
            <TitleLg>{t("editUser.profileInfo")}</TitleLg>
            <RoundedGrayButton
              onClick={() => setIsEditing(!isEditing)}
              style={{ fontSize: "2rem", width: "4rem", height: "100%" }}
            >
              <FaPen />
            </RoundedGrayButton>
          </div>
          <div className="mt-4 d-flex flex-column align-items-center">
            <div
              className="rounded-block company-logo mb-4"
              style={{ width: "10rem", height: "10rem", fontSize: "4rem" }}
            >
              {mainData!.user.full_name[0]}
            </div>
            <div className={styles["profile-name"]}>
              {mainData?.user.full_name}
            </div>
            <EditUserForm isEditing={isEditing} setIsEditing={setIsEditing} />
          </div>
        </RoundedWhiteBox>
      </Col>
    </Row>
  );
}
