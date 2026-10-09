# MatchMã

Website hỗ trợ rà soát và đối chiếu danh mục hàng hóa với giao diện thích ứng máy tính và điện thoại.

## Dữ liệu hỗ trợ
- Nhập trực tiếp Excel `.xlsx`, `.xls` và `.csv`.
- Với Excel, ứng dụng đọc sheet đầu tiên trong trình duyệt bằng SheetJS; không cần chuyển đổi thủ công.
- Xuất file kết quả `.xlsx`, có thể mở bằng Microsoft Excel.
- Tải file Excel mẫu để thử trước.
- Dòng danh mục chuẩn không có SKU/mã hàng bị loại khỏi tập ứng viên ghép.

## Triển khai
Ứng dụng Node.js/Express; `render.yaml` cấu hình Render Web Service ở Singapore, gói free. Health endpoint: `/health`.

## Lưu ý
Điểm tương đồng hiện là điểm gần nhau của tên hàng, không phải xác nhận chắc chắn cùng sản phẩm. Cần rà soát SKU, quy cách, đơn vị và tồn kho trước khi quyết định ghép. File Excel được đọc trên trình duyệt; thư viện SheetJS được tải từ CDN chính thức.
