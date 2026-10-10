// Test mau cho mot luat nghiep vu, viet tu kich ban Given-When-Then.
//
// Chay o goc kho:   node --test
// Can Node 20 tro len, khong phai cai gi them. Nhom dung Jest thi xem ban Jest o to TC8.
// package.json cua nhom co "type": "module" thi thay hai dong require dau tien bang
//   import test from "node:test";
//   import assert from "node:assert/strict";
//
// Phan "Ma mau" chi de tep nay tu chay duoc khi kho chua co ma. Trong do an, lop Don
// nam o src/ va tep test chi require hoac import vao. Co test that roi thi xoa tep nay.
const test = require("node:test");
const assert = require("node:assert/strict");

// ---- Ma mau. Trong do an, phan nay nam o src/ ----

class KhongHuyDuoc extends Error {
  name = "KhongHuyDuoc";
}

class Don {
  constructor(ma, { trangThai = "cho_xac_nhan" } = {}) {
    this.ma = ma;
    this.trangThai = trangThai;
  }

  huy(lyDo) {
    if (this.trangThai !== "cho_xac_nhan") throw new KhongHuyDuoc("Quay da nhan don, khong huy duoc");
    this.trangThai = "da_huy";
    this.lyDoHuy = lyDo;
  }
}

// ---- Test cho BR-03: quay da nhan don thi khach khong huy duoc ----

test("BR03_quay_da_nhan_thi_khong_huy_duoc", () => {
  // Arrange (Given): don DH-002 dang Da xac nhan
  const don = new Don("DH-002", { trangThai: "da_xac_nhan" });

  // Act (When): khach bam Huy
  const huy = () => don.huy("Doi y");

  // Assert (Then): bao loi, don van Da xac nhan
  assert.throws(huy, { name: "KhongHuyDuoc", message: "Quay da nhan don, khong huy duoc" });
  assert.equal(don.trangThai, "da_xac_nhan");
});

test("BR03_quay_chua_nhan_thi_huy_duoc", () => {
  // Arrange (Given): don DH-001 dang Cho xac nhan
  const don = new Don("DH-001");

  // Act (When): khach bam Huy, chon ly do "Doi y"
  don.huy("Doi y");

  // Assert (Then): don chuyen sang Da huy
  assert.equal(don.trangThai, "da_huy");
});
