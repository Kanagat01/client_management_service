import { TransporterCompany } from "~/entities/User";
import styles from "./styles.module.scss";

export const CompanyCard = (
  comp: Omit<TransporterCompany, "managers" | "user">
) => {
  return (
    <div className="d-flex align-items-center mb-4">
      <div className="rounded-block company-logo">{comp.company_name[0]}</div>
      <div className="d-flex flex-column ms-3">
        <span className={styles.companyName}>
          {comp.company_name} ({comp.transporter_company_id})
        </span>
      </div>
    </div>
  );
};
