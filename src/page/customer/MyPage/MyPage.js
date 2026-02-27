import React, { useState } from "react";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import OrderStatusCard from "./component/OrderStatusCard";
import "./style/orderStatus.style.css";
import { getOrder } from "../../../features/order/orderSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";

const MyPage = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const { orderList, totalPageNum } = useSelector((state) => state.order);
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1
  }); 

  useEffect(() => {
    dispatch(getOrder({...searchQuery}));
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams(searchQuery);
    const query = params.toString();
    navigate('?' + query);
  }, [searchQuery]);

  const handlePageClick = ({ selected }) => {
    //  쿼리에 페이지값 바꿔주기
    setSearchQuery({...searchQuery, page: selected + 1});
  };

  if (orderList?.length === 0) {
    return (
      <Container className="order-page">
        <div>진행중인 주문이 없습니다.</div>
      </Container>
    );
  };

  return (
    <Container className="order-page">
      {orderList?.map((item) => (
        <OrderStatusCard
          orderItem={item}
          key={item._id}
        />
      ))}
      <ReactPaginate
        previousLabel="‹"
        nextLabel="›"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPageNum}
        forcePage={searchQuery.page - 1}
        containerClassName="cs-pagination"

        pageClassName="cs-page"
        pageLinkClassName="cs-page-link"

        previousClassName="cs-page cs-nav-btn"
        nextClassName="cs-page cs-nav-btn"
        previousLinkClassName="cs-page-link"
        nextLinkClassName="cs-page-link"

        activeClassName="active"
      />
    </Container>
  );
};

export default MyPage;
