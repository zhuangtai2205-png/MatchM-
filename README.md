# MatchMã

Website hỗ trợ rà soát và đối chiếu danh mục hàng hóa. Quy tắc quan trọng: chỉ sử dụng dòng danh mục chuẩn có SKU/mã hàng làm ứng viên; dòng thiếu mã bị loại.

## Chạy
- Node.js 18+
- `npm install`
- `npm start`

Mở `http://localhost:3000`. Bản web hiện xử lý CSV trực tiếp trong trình duyệt. Với Excel `.xlsx`/`.xls`, hãy xuất sheet thành CSV UTF-8 trước khi tải lên. Kết quả xuất CSV mở được bằng Excel.

## Triển khai
`render.yaml` cấu hình Render Web Service vùng Singapore, gói free, health check `/health`.

## Lưu ý
Điểm tương đồng tên là gợi ý, không thay thế kiểm tra SKU/quy cách/đơn vị tồn kho. Kiểm tra thủ công trước khi quyết định ghép.