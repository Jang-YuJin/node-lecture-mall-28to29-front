import React from "react";
import { Table, Badge } from "react-bootstrap";
import { badgeBg } from "../../../../constants/order.constants";
import { currencyFormat } from "../../../../utils/number";

const OrderTable = ({ header, data, openEditForm, currentPage = 1, pageSize = 1 }) => {
  return (
    <div className="seller-order-table-wrapper">
      <table className="seller-order-table">
        <thead>
          <tr>
            {header.map((title) => (
              <th>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr onClick={() => openEditForm(item)} className="seller-order-row">
                <th>{(Number(currentPage) - 1) * Number(pageSize) + index + 1}</th>
                <th>{item.orderNum}</th>
                <th>{item.createdAt.slice(0, 10)}</th>
                <th>{item.userId.email}</th>
                {item.items.length > 0 ? (
                  <th>
                    {item.items[0].lectureId.name}
                    {item.items.length > 1 && `외 ${item.items.length - 1}개`}
                  </th>
                ) : (
                  <th></th>
                )}

                <th>{item.shipAddrss.address + " " + item.shipAddrss.city}</th>

                <th>{currencyFormat(item.ttlPrc)}</th>
                <th>
                  <Badge bg={badgeBg[item.status]}>{item.status}</Badge>
                </th>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="no-order-data">
                주문 데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default OrderTable;
