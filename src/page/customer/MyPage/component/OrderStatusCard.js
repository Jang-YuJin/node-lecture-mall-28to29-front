import React, { useState } from "react";
import { Row, Col, Badge } from "react-bootstrap";
import { badgeBg } from "../../../../constants/order.constants";
import { currencyFormat } from "../../../../utils/number";

const OrderStatusCard = ({ orderItem }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="order-card-wrapper">
      <Row className="order-card">
        <Col md={2} xs={3}>
          <img
            src={orderItem.items[0]?.lectureId?.img}
            alt={orderItem.items[0]?.lectureId?.name}
            className="order-thumb"
          />
        </Col>
        <Col md={7} xs={9} className="order-info">
          <div className="order-num">주문번호 {orderItem.orderNum}</div>
          <div className="order-date">{orderItem.createdAt.slice(0, 10)}</div>

          <div className="order-title">
            {orderItem.items[0]?.lectureId.name}
            {orderItem.items.length > 1 && (
              <span className="order-more">
                {" "}외 {orderItem.items.length - 1}개
              </span>
            )}
          </div>
          <div className="order-price">
            ₩ {currencyFormat(orderItem.ttlPrc)}
          </div>

          {orderItem.items.length > 1 && (
            <button
              className={`order-toggle ${open ? "open" : ""}`}
              onClick={() => setOpen(!open)}
            >
              {open ? "접기 ▲" : "더보기 ▼"}
            </button>
          )}
        </Col>
        <Col md={3} xs={12} className="order-status">
          <Badge bg={badgeBg[orderItem.status]}>
            {orderItem.status}
          </Badge>
        </Col>
      </Row>
      {/* 아코디언 영역 */}
      <div className={`order-accordion ${open ? "show" : ""}`}>
        {orderItem.items.map((item, idx) => {
          const lecture = item.lectureId;
          const isDiscount = item.dscntYn;

          return (
            <div key={idx} className="order-detail-card">
              <img
                src={lecture.img}
                alt={lecture.name}
                className="detail-thumb"
              />

              <div className="detail-info">
                <div className="detail-title">{lecture.name}</div>

                <div className="detail-price">
                  {isDiscount ? (
                    <span className="order-sale-price">
                      ₩ {currencyFormat(lecture.price)}
                        <span>(-₩ {currencyFormat(lecture.price - (lecture.price * (1 - item.dscntRt * 0.01)))})</span>
                    </span>
                  ) : 
                  <span className="order-sale-price">
                    ₩ {currencyFormat(lecture.price)}
                  </span>}
                </div>

                <div className="detail-meta">
                  <span>📄 파일교재: {item.fileTxtbkType}</span>
                    <span>
                      📦 실물교재: {item.txtbkType == 'bind' ? '제본(스프링) 교재' : '책 교재'} x {item.qty} (₩ {currencyFormat(item.txtbkPrice * (item.qty - 1))})
                    </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusCard;
