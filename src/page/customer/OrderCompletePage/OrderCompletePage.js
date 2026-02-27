import React from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";
import "./style/OrderCompletePage.style.css";

const OrderCompletePage = () => {
  const { orderNum } = useSelector((state) => state.order);
  const location = useLocation();

  if(!orderNum || !location.state?.fromPayment){
    return <Navigate to='/cart' replace></Navigate>;
  }
  
  if (orderNum === "")
    return (
      <Container className="confirmation-wrapper">
        <div className="confirmation-card fail">
          <div className="fail-icon">⚠️</div>

          <h2 className="confirmation-title">주문에 실패했어요</h2>

          <p className="confirmation-desc">
            주문 처리 중 문제가 발생했습니다.
          </p>

          <p className="confirmation-sub">
            잠시 후 다시 시도하시거나 메인 페이지로 이동해주세요.
          </p>

          <div className="confirmation-actions">
            <Link to="/" className="confirm-btn primary">
              메인페이지로 돌아가기
            </Link>
            <Link to="/cart" className="confirm-btn ghost">
              장바구니로 이동
            </Link>
          </div>
        </div>
      </Container>
    );
  return (
    <Container className="confirmation-wrapper">
      <div className="confirmation-card">
        <img
          src="/image/greenCheck.png"
          className="check-image"
          alt="success"
        />

        <h2 className="confirmation-title">주문이 완료되었습니다 🎉</h2>

        <p className="confirmation-desc">
          주문번호 <strong>{orderNum}</strong>
        </p>

        <p className="confirmation-sub">
          주문 내역은 <strong>내 주문</strong> 메뉴에서 확인하실 수 있어요.
        </p>

        <div className="confirmation-actions">
          <Link to="/account/purchase" className="confirm-btn primary">
            내 주문 바로가기
          </Link>
          <Link to="/" className="confirm-btn ghost">
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default OrderCompletePage;
