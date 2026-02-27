import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { useSearchParams, useNavigate } from "react-router-dom";
import OrderDetailDialog from "./component/OrderDetailDialog";
import OrderTable from "./component/OrderTable";
import SearchBox from "../../../common/component/SearchBox";
import {
  getOrderList,
  setSelectedOrder,
} from "../../../features/order/orderSlice";
import "./style/sellerOrder.style.css";
import Loading from "../../../common/component/Loading";
import { ORDER_PAGE_SIZE } from "../../../constants/order.constants";

const SellerOrderPage = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const { orderList, totalPageNum, loading } = useSelector((state) => state.order);
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    ordernum: query.get("ordernum") || "",
  });
  const [open, setOpen] = useState(false);

  const tableHeader = [
    "순번",
    "주문번호",
    "주문날짜",
    "주문자",
    "구매 강의",
    "주소",
    "총가격",
    "상태",
  ];

  useEffect(() => {
    dispatch(getOrderList({ ...searchQuery }));
  }, [query]);

  useEffect(() => {
    if (searchQuery.ordernum === "") {
      delete searchQuery.ordernum;
    }
    const params = new URLSearchParams(searchQuery);
    const queryString = params.toString();

    navigate("?" + queryString);
  }, [searchQuery]);

  const openEditForm = (order) => {
    setOpen(true);
    dispatch(setSelectedOrder(order));
  };

  const handlePageClick = ({ selected }) => {
    setSearchQuery({ ...searchQuery, page: selected + 1 });
  };

  const handleClose = () => {
    setOpen(false);
  };

  if(loading){
    return(
      <Container>
        <Loading message="주문을 불러오는 중이에요"/>
      </Container>
    )
  }

  return (
    <div className="seller-locate-center">
      <Container>
        <div className="mt-2 mb-2">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="주문번호"
            field="ordernum"
          />
        </div>

        <OrderTable
          header={tableHeader}
          data={orderList}
          openEditForm={openEditForm}
          pageSize={ORDER_PAGE_SIZE}
          currentPage={Number(searchQuery.page) || 1}

        />
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

      {open && <OrderDetailDialog open={open} handleClose={handleClose} />}
    </div>
  );
};

export default SellerOrderPage;
