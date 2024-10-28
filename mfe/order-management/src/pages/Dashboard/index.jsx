import React from "react";
import OrderList from "./OrderList";
import Filters from "./Filters";
import { OrderProvider } from "../../context/PageContext";
import { Button, Card } from "@mfe/ui-components";
import "./index.scss";
import { useTranslation } from "react-i18next";

export default function () {
  const { t } = useTranslation();
  return (
    <div className="orderContainer">
      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        <h1>{t("orders")}</h1>
        <div className="addOrderBtn">
          <Button label={t("create_new_order")} />
        </div>
      </div>
      <OrderProvider>
        <Card
          bodyContent={
            <div className="orderCardContainer">
              <Filters />
              <OrderList />
            </div>
          }
        />
      </OrderProvider>
    </div>
  );
}



