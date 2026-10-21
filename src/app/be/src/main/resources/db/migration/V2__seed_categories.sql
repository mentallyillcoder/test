-- =====================================================================
-- V2: Dữ liệu danh mục ban đầu (giao diện tiếng Anh nên tên tiếng Anh).
-- Tài khoản Admin không seed ở đây: Admin nằm trong Keycloak, bảng users
-- tự tạo bản ghi khi Admin đăng nhập lần đầu.
-- =====================================================================
INSERT INTO categories (name) VALUES
                                  ('Programming'),
                                  ('Data Science'),
                                  ('Languages'),
                                  ('Mathematics'),
                                  ('Business'),
                                  ('Design');