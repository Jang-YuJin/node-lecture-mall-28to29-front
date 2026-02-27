import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import OrderReceipt from "./component/OrderReceipt";
import PaymentForm from "./component/PaymentForm";
import "./style/paymentPage.style.css";
import { cc_expires_format, phone_format } from "../../../utils/number";
import { createOrder } from "../../../features/order/orderSlice";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const { orderNum } = useSelector((state) => state.order);
  const [cardValue, setCardValue] = useState({
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });
  const navigate = useNavigate();
  const [firstLoading, setFirstLoading] = useState(true);
  const [shipInfo, setShipInfo] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    city: "",
    zip: "",
  });
  const {cartList, totalPrice} = useSelector(state => state.cart);

  useEffect(() => {
    // 오더번호를 받으면 어디로 갈까?
    if(firstLoading){
      setFirstLoading(false);
    } else {
      if(orderNum !== ''){
        navigate('/payment/success', {
          replace: true,
          state: { fromPayment: true },
        });
      }
    }
  }, [orderNum]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // 오더 생성하기
    const {firstName, lastName, contact, address, city, zip} = shipInfo;

    dispatch(createOrder({
      ttlPrc: totalPrice,
      shipAddrss: {address, city, zip},
      contact: {firstName, lastName, contact},
      orderList: cartList.map((item) => {
        return {
          lectureId: item.lectureId._id,
          txtbkType: item.txtbk,
          fileTxtbkType: item.fileTxtbk,
          qty: item.qty,
          price: item.lectureId.dscnt ? item.lectureId.price * (1 - item.lectureId.dscntRt * 0.01) + (item.qty - 1) * item.lectureId.txtbkPrice[item.txtbk] : item.lectureId.price + (item.qty - 1) * item.lectureId.txtbkPrice[item.txtbk],
          dscntYn: item.lectureId.dscnt,
          dscntRt: item.lectureId.dscntRt,
          txtbkPrice: item.lectureId.txtbkPrice[item.txtbk]
        }
      })
    }));
  };

  const handleFormChange = (event) => {
    //shipInfo에 값 넣어주기
    const {name, value} = event.target;
    if(name === 'contact'){
      let newValue = phone_format(value);
      setShipInfo({...shipInfo, [name]: newValue});
      return ;
    }
    setShipInfo({...shipInfo, [name]: value});
  };

  const handlePaymentInfoChange = (event) => {
    //카드정보 넣어주기
    const {name, value} = event.target;
    if(name === 'expiry'){
      let newValue = cc_expires_format(value);
      setCardValue({...cardValue, [name]: newValue});
      return ;
    }
    setCardValue({...cardValue, [name]: value});
  };

  const handleInputFocus = (e) => {
    setCardValue({ ...cardValue, focus: e.target.name });
  };

  if (cartList?.length === 0) {
    navigate("/cart");
  }// 주문할 아이템이 없다면 주문하기로 안넘어가게 막음
  
  return (
    <Container>
      <Row>
        <Col lg={7}>
          <div>
            <h2 className="mb-2">배송 주소</h2>
            <div>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="lastName">
                    <Form.Label>성</Form.Label>
                    <Form.Control
                      className="form-control-order"
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="lastName"
                      placeholder="성"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="firstName">
                    <Form.Label>이름</Form.Label>
                    <Form.Control
                      className="form-control-order"
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="firstName"
                      placeholder="이름"
                    />
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formGridAddress1">
                  <Form.Label>연락처</Form.Label>
                  <Form.Control
                    className="form-control-order"
                    placeholder="010-xxx-xxxxx"
                    onChange={handleFormChange}
                    required
                    name="contact"
                    value={shipInfo.contact}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridAddress2">
                  <Form.Label>주소</Form.Label>
                  <Form.Control
                    className="form-control-order"
                    placeholder="주소를 입력하세요."
                    onChange={handleFormChange}
                    required
                    name="address"
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>상세주소</Form.Label>
                    <Form.Control
                      className="form-control-order"
                      onChange={handleFormChange}
                      placeholder="상세주소를 입력하세요."
                      required
                      name="city"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridZip">
                    <Form.Label>우편번호</Form.Label>
                    <Form.Control
                      className="form-control-order"
                      onChange={handleFormChange}
                      required
                      name="zip"
                      placeholder="123456"
                    />
                  </Form.Group>
                </Row>
                <div className="mobile-receipt-area">
                  <OrderReceipt cartList={cartList} totalPrice={totalPrice}/>
                </div>
                <div>
                  <h2 className="payment-title">결제 정보</h2>
                  <PaymentForm cardValue={cardValue} handleInputFocus={handleInputFocus} handlePaymentInfoChange={handlePaymentInfoChange}></PaymentForm>
                </div>

                <Button
                  variant="dark"
                  className="payment-button pay-button"
                  type="submit"
                >
                  결제하기
                </Button>
              </Form>
            </div>
          </div>
        </Col>
        <Col lg={5} className="receipt-area">
          <OrderReceipt cartList={cartList} totalPrice={totalPrice}/>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
