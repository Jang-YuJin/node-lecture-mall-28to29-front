import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button, Dropdown, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { currencyFormat } from "../../../utils/number";
import "./style/LectureDetail.style.css";
import { getLectureDetail } from "../../../features/lecture/lectureSlice";
import { addToCart } from "../../../features/cart/cartSlice";
import Loading from "../../../common/component/Loading";

const LectureDetail = () => {
  const dispatch = useDispatch();
  const { selectedLecture, loading } = useSelector((state) => state.lecture);
  const [selectedFileTxtbk, setSelectedFileTxtbk] = useState("");
  const [selectedTxtbk, setSelectedTxtbk] = useState("");
  const [txtbkCnt, setTxtbkCnt] = useState(1);
  const { id } = useParams();
  const [fileTxtbkError, setFileTxtbkError] = useState(false);
  const [txtbkError, setTxtbkError] = useState(false);
  const [txtbkCntError, setTxtbkCntError] = useState(false);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const isDiscounted = selectedLecture?.dscnt;
  const discountRate = Number(selectedLecture?.dscntRt);
  const discountedPrice = Math.floor(
    selectedLecture?.price * (1 - discountRate * 0.01)
  );

  const addItemToCart = () => {
    let hasError = false;
    // 파일교재, 실물교재 아직 선택안했다면 에러
    if(selectedFileTxtbk === ''){
      setFileTxtbkError(true);
      hasError = true;
    }
    if(selectedTxtbk === ''){
      setTxtbkError(true);
      hasError = true;
    }
    // 교재 수량이 10개를 초과하거나 0개일 경우 에러
    if(txtbkCnt > 10 || txtbkCnt <= 0){
      setTxtbkCntError(true);
      hasError = true;
    }
    if(hasError){
      return ;
    }
    // 아직 로그인을 안한유저라면 로그인페이지로
    if(!user) {
      navigate('/login');
    }
    // 카트에 아이템 추가하기
    dispatch(addToCart({id, fileTxtbk: selectedFileTxtbk, txtbk: selectedTxtbk, qty: txtbkCnt}));
  };

  const selectFileTxtbk = (type) => {
    setSelectedFileTxtbk(type);
    if(fileTxtbkError){
      setFileTxtbkError(false);
    }
  };

  const selectTxtbk = (type) => {
    setSelectedTxtbk(type);
    if(txtbkError){
      setTxtbkError(false);
    }
  };

  useEffect(() => {
    dispatch(getLectureDetail(id));
  }, [id, dispatch]);

  if (loading){
    return(
      <Container>
        <Loading message="강의를 불러오는 중이에요"/>
      </Container>
    )
  }

  if (!selectedLecture){
    return(
      <Container>
        <div>강의를 불러오는데 오류가 발생했습니다.</div>
        <div>관리자에게 문의하세요.</div>
      </Container>
    )
  }

  return (
    <Container className="product-detail-card">
      <Row>
        <Col sm={6}>
          <img src={selectedLecture.img} className="w-100" alt="image" />
        </Col>
        <Col className="product-info-area" sm={6}>
          <div className="product-title">{selectedLecture.name}</div>
          <div className="price-section">
            {isDiscounted ? (
              <div className="price-row">
                <span className="discount-badge-detail">
                  🔥 {discountRate}% OFF
                </span>
                <span className="original-price">
                  ₩ {currencyFormat(selectedLecture.price)}
                </span>
                <span className="discounted-price">
                  ₩ {currencyFormat(discountedPrice)}
                </span>
              </div>
            ) : (
              <div className="normal-price">
                ₩ {currencyFormat(selectedLecture.price)}
              </div>
            )}
          </div>
          <div className="product-desc">{selectedLecture.desc}</div>

          {selectedLecture.fileTxtbk?.length > 0 && (
            <div className={`material-section ${fileTxtbkError ? "error" : ""}`}>
              <div className="section-title">📁 파일 교재</div>
              <div className="material-options">
                {selectedLecture.fileTxtbk.map((type) => (
                <div key={type} className="mb-2">
                  <input
                    type="radio"
                    name="fileMaterial"
                    id={`file-${type}`}
                    value={type}
                    checked={selectedFileTxtbk === type}
                    onChange={() => selectFileTxtbk(type)}
                  />
                  <label htmlFor={`file-${type}`} className="ms-2">
                    {type}
                  </label>
                </div>
                ))}
              </div>
              {fileTxtbkError && (
                <div className="error-text">파일 교재를 선택해주세요.</div>
              )}
            </div>
          )}

          {selectedLecture.txtbkStck && (
            <div className={`material-section ${txtbkError ? "error" : ""}`}>
              <div className="section-title">📚 실물 교재</div>
              <select
                className={`form-select ${txtbkError ? "is-invalid" : ""}`}
                value={selectedTxtbk}
                onChange={(e) => selectTxtbk(e.target.value)}
              >
                <option value="" disabled>선택해주세요</option>
                <option
                  value="bind"
                  disabled={selectedLecture.txtbkStck?.bind <= 0}
                >
                  제본(스프링) 교재 ({currencyFormat(Number(selectedLecture.txtbkPrice.bind))}원)
                </option>
                <option
                  value="book"
                  disabled={selectedLecture.txtbkStck?.book <= 0}
                >
                  책 교재 ({currencyFormat(Number(selectedLecture.txtbkPrice.book))}원)
                </option>
              </select>
              {txtbkError && (
                <div className="error-text">실물 교재를 선택해주세요.</div>
              )}
            </div>
          )}

          {selectedLecture.txtbkPrice && (
            <div className={`material-section ${txtbkCntError ? "error" : ""}`}>
              <div className="section-title">📦 실물 교재 수량</div>
              <Form.Control name="txtbk-price" type="number" min={1} max={10} value={txtbkCnt} onChange={(e) => setTxtbkCnt(e.target.value)} />
              {txtbkCntError && (
                <div className="error-text">실물 교재 수량은 1권 이상 10권 이하만 가능합니다.</div>
              )}
            </div>
          )}
          
          <div>※ 강의 구매시 실물 교재는 1권만 강의가격에 포함됩니다.</div>
          <div>※ 실물 교재는 2권 이상 구매 시 교재비가 추가 됩니다. (최대 구매는 10권까지 가능합니다.)</div>

          <div className="total-price">총 가격: <span>₩ {isDiscounted ? currencyFormat(discountedPrice + ((txtbkCnt == 0 ? 1 : txtbkCnt) - 1) * (selectedLecture.txtbkPrice[selectedTxtbk] ?? 0)) : currencyFormat(Number(selectedLecture.price + ((txtbkCnt == 0 ? 1 : txtbkCnt) - 1) * (selectedLecture.txtbkPrice[selectedTxtbk] ?? 0)))}</span></div>
          <Button
            variant="dark"
            className="add-button"
            onClick={addItemToCart}
          >
            장바구니 담기
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default LectureDetail;