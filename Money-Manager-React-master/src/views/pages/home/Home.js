/* eslint-disable prettier/prettier */
import React from 'react'
import img1 from '../../../assets/images/Homepage/img1.png';
import img2 from '../../../assets/images/Homepage/img2.png';
import img3 from '../../../assets/images/Homepage/img3.png';
import icon1 from '../../../assets/images/Homepage/icon1.png';
import icon2 from '../../../assets/images/Homepage/icon2.png';
import icon3 from '../../../assets/images/Homepage/icon3.png';

const App = () => {
  return (
    <div>
      <section id="banner_header" className="header_area2">
        <div className="container">
          <div className="row banner_text">
            <div className="col-lg-5 offset-lg-4 col-md-8 offset-md-3">
              <h2>Cách đơn giản nhất</h2>
            </div>
          </div>
          <div className="row banner_text">
            <div className="col-lg-5 offset-lg-4 col-md-8 offset-md-3">
              <h2>Để quản lý chi tiêu cá nhân</h2>
            </div>
          </div>
          <div className="row banner_text">
            <div className="col-lg-4 offset-lg-5 col-md-8 offset-md-3 type_text">
              <h1 className="cd-headline clip is-full-width">
                <button className="start">
                  <a href="/register">Bắt đầu ngay</a>
                </button>
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="about_me">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="about_part">
                <img src={img1} className="img-fluid" alt="img" />
              </div>
            </div>
            <div className="col-lg-8 col-md-6">
              <div className="heading gap">
                <h2>Ghi chép thu chi trở nên dễ dàng hơn</h2>
                <p>
                  Bạn chỉ tốn vài phút để ghi chép lại chi tiêu hàng ngày của mình, và phân loại vào
                  các mục như là: Thức Ăn, Mua sắm; hay là thêm các khoản thu nhập như Lương, Quà
                  tặng, v.v...
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8 col-md-6">
              <div className="heading gap">
                <h2>Theo dõi và quản lý tiền hiệu quả</h2>
                <p>
                  Ứng dụng tự động tạo cho bạn những biểu đồ báo cáo cực kỳ dễ nhìn, dễ hiểu, dễ
                  nhớ, cho bạn một cái nhìn rõ ràng về các khoản thu chi của bản thân. Chẳng còn
                  hoang mang không rõ 'tiền về nơi đâu' nữa!
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="about_part">
                <img src={img2} className="img-fluid" alt="img" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="about_part">
                <img src={img3} className="img-fluid" alt="img" />
              </div>
            </div>
            <div className="col-lg-8 col-md-6">
              <div className="heading gap">
                <h2>Ghi chép thu chi trở nên dễ dàng hơn</h2>
                <p>
                  Bạn chỉ tốn vài phút để ghi chép lại chi tiêu hàng ngày của mình, và phân loại vào
                  các mục như là: Thức Ăn, Mua sắm; hay là thêm các khoản thu nhập như Lương, Quà
                  tặng, v.v...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="service" className="my_services common">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="heading text-center">
                <h2>Các tính năng nổi bật</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="service_inner" className="my_services">
        <div className="container">
          <div className="row service_slic">
            <div className="col-md-4">
              <div className="service_inner graphice text-center">
                <div className="interest_icon">
                  <img src={icon1} className="img-fluid" alt="" />
                </div>
                <h4>Sử dụng trên nhiều thiết bị một lúc</h4>
                <p>
                  Money Lover có thể đồng bộ trên tất cả thiết bị và các nền tảng với tiêu chuẩn bảo
                  mật chặt chẽ.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="service_inner text-center">
                <div className="interest_icon">
                  <img src={icon2} className="img-fluid" alt="" />
                </div>
                <h4>Tự động nhắc nhở các khoản thu chi định kì</h4>
                <p>
                  Nhắc nhở bạn về các khoản thu chi định kỳ hàng tuần, hàng tháng, hàng năm... trước
                  ngày giao dịch.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="service_inner text-center">
                <div className="interest_icon">
                  <img src={icon3} className="img-fluid" alt="" />
                </div>
                <h4>Tiết kiệm cho dự định tương lai</h4>
                <p>
                  Được nhắc nhở thường xuyên về khoản tiết kiệm, bạn sẽ nhanh chóng đạt được mục
                  tiêu tài chính mà mình đề ra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
