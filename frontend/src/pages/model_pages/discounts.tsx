import { ReactNode } from "react";
import { useUnit } from "effector-react";
import { CommandBar, FilterBar } from "~/widgets";
import { PageSizeSelector } from "~/features/filters";
import {
  $discounts,
  CreateOrEditDiscount,
  getDiscountColumns,
  getDiscountsFx,
} from "~/entities/Discount";
import { RenderPromise } from "~/shared/api";
import { MainTable } from "~/shared/ui";

const menuList: ReactNode[] = [<CreateOrEditDiscount />];

const getFilters = (): ReactNode[] => [<PageSizeSelector />];

export function DiscountsPage() {
  const data = useUnit($discounts);
  const columns = getDiscountColumns();

  return (
    <>
      <CommandBar title="Акции" menuList={menuList} />
      <div className="mb-md-4 h-100">
        <FilterBar getFilters={getFilters} />

        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getDiscountsFx, {
            success: <MainTable data={data} columns={columns} />,
          })}
        </div>
      </div>
    </>
  );
}
