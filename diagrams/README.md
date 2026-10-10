# Sơ đồ

Tất cả viết bằng **Mermaid**, đuôi `.mmd`. GitHub render trực tiếp khi mở tệp `.md` có khối ```mermaid. Còn kiểm gói thì đọc tệp `.mmd` thuần, nên ở đây **không** bọc trong ```mermaid.

## Tên tệp kiểm gói tìm

| Gói | Tệp | Loại Mermaid |
|---|---|---|
| 3 | `use-case.mmd` | `flowchart` (Mermaid chưa có use case chuẩn, xem quy ước bên dưới) |
| 3 | `seq-*.mmd` (≥ 2 tệp) | `sequenceDiagram` |
| 4 | `class.mmd` | `classDiagram` |
| 4 | `state.mmd` | `stateDiagram-v2` |
| 5 | `c4-context.mmd`, `c4-container.mmd` | `C4Context`, `C4Container` |

## Quy ước use case bằng flowchart

```
flowchart LR
  SV([Sinh viên])
  GV([Giáo vụ])
  subgraph HT[Hệ thống đặt phòng]
    UC1(Đặt phòng)
    UC2(Duyệt đặt phòng)
    UC3(Xác thực)
  end
  SV --> UC1
  GV --> UC2
  UC1 -. include .-> UC3
```

Tác nhân dùng `([ ])`, use case dùng `( )`, include dùng mũi tên đứt `-. include .->`. Extend thì chỉ cần đọc được khi gặp, đồ án không bắt vẽ (xem `tra-cuu/TC4-uml.md`).

## Quy ước để kiểm gói đối chiếu chéo được

- Tên lớp trong `class.mmd`: `class TenLop {`
- Tên lớp trong `seq-*.mmd`: `participant TenLop`, **dùng đúng tên lớp**, đừng đặt biệt danh, vì kiểm gói lấy hiệu hai tập tên.
- Phương thức gọi trong sequence: `A->>B: tenPhuongThuc(...)`. Kiểm gói xem `tenPhuongThuc` có trong lớp `B` không.
- **Mỗi lớp trong `class.mmd` phải được nhắc tên, đúng chính tả, trong ít nhất một tệp ở `docs/`**, đặc tả use case hoặc `yeu-cau.md` đều được. Lớp không sinh ra từ yêu cầu nào thì kiểm gói báo.
- Tên lớp: chữ không dấu, số, gạch dưới. `class Phong` được; `class Phòng` không.
- Từ Gói 6, mọi lớp trong `class.mmd` phải có trong `src/` với đúng tên đó.
- Ghi mã người phụ trách ở dòng đầu sau khai báo loại sơ đồ: `%% Phụ trách: N07-B`.

## Xem trước

VS Code thì cài extension "Markdown Preview Mermaid Support", hoặc dán thẳng vào `mermaid.live`.

Trước khi push, kiểm cú pháp ở máy mình: `npx -y @mermaid-js/mermaid-cli -i diagrams/class.mmd -o /tmp/x.svg`
