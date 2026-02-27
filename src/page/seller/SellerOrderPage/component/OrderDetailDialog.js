import React, { useState } from "react";
import { Form, Modal, Button, Col, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ORDER_STATUS } from "../../../../constants/order.constants";
import { currencyFormat } from "../../../../utils/number";
import { updateOrder } from "../../../../features/order/orderSlice";

const OrderDetailDialog = ({ open, handleClose }) => {
  const selectedOrder = useSelector((state) => state.order.selectedOrder);
  const [orderStatus, setOrderStatus] = useState(selectedOrder.status);
  const dispatch = useDispatch();

  const handleStatusChange = (event) => {
    setOrderStatus(event.target.value);
  };
  const submitStatus = () => {
    dispatch(updateOrder({ id: selectedOrder._id, status: orderStatus }));
    handleClose();
  };

  if (!selectedOrder) {
    return <></>;
  }
  return (
    <Modal show={open} onHide={handleClose} centered dialogClassName="seller-order-cs-modal">
      <Modal.Header closeButton>
        <Modal.Title>주문 상세</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* 주문 기본 정보 */}
        <div className="seller-order-cs-section">
          <div className="seller-order-cs-section-title">주문 정보</div>
          <div className="seller-order-cs-info-grid">
            <div>
              <span>주문번호</span>
              <strong>{selectedOrder.orderNum}</strong>
            </div>
            <div>
              <span>주문날짜</span>
              <strong>
                {selectedOrder.createdAt.slice(0, 10)}
              </strong>
            </div>
            <div>
              <span>구매자</span>
              <strong>{selectedOrder.userId.email}</strong>
            </div>
          </div>
        </div>

        {/* 배송 정보 */}
        <div className="seller-order-cs-section">
          <div className="seller-order-cs-section-title">배송 정보</div>
          <div className="seller-order-cs-info-grid">
            <div>
              <span>주소</span>
              <strong>
                {selectedOrder.shipAddrss.address}{" "}
                {selectedOrder.shipAddrss.city}
              </strong>
            </div>
            <div>
              <span>연락처</span>
              <strong>
                {selectedOrder.contact.firstName}
                {selectedOrder.contact.lastName}{" "}
                {selectedOrder.contact.contact}
              </strong>
            </div>
          </div>
        </div>

        {/* 주문 내역 */}
        <div className="seller-order-cs-section">
          <div className="seller-order-cs-section-title">주문 내역<span>※ 강의 한개당 교재 1권 가격을 포함합니다. 교재 2권부터 교재값이 추가됩니다.</span></div>

          {selectedOrder.items.map((item) => (
            <div key={item._id} className="seller-order-cs-order-item">
              <div className="seller-order-cs-order-left">
                <div className="seller-order-cs-order-title">
                  {item.lectureId.name}
                </div>
                <div className="seller-order-cs-order-meta">
                  {item.txtbkType === "bind"
                    ? "제본(스프링) 교재"
                    : "책 교재"}{" "}
                  · {item.qty}권 (권당 교재 가격: ₩ {currencyFormat(item.txtbkPrice)})
                </div>
              </div>

              <div className="seller-order-cs-order-right">
                ₩ {currencyFormat(item.price)}
              </div>
            </div>
          ))}

          <div className="seller-order-cs-total">
            총 결제금액
            <span>
              ₩ {currencyFormat(selectedOrder.ttlPrc)}
            </span>
          </div>
        </div>

        {/* 상태 변경 */}
        <Form onSubmit={submitStatus} className="seller-order-cs-status-form">
          <Form.Label>주문 상태</Form.Label>
          <Form.Select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
          >
            {ORDER_STATUS.map((item, idx) => (
              <option key={idx} value={item.toLowerCase()}>
                {item}
              </option>
            ))}
          </Form.Select>

          <div className="seller-order-cs-button-row">
            <Button variant="light" onClick={handleClose}>
              닫기
            </Button>
            <Button type="submit" className="seller-order-cs-primary-btn">
              저장
            </Button>
          </div>
        </Form>

      </Modal.Body>
    </Modal>
  );
};

export default OrderDetailDialog;
