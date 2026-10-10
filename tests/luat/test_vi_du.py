"""Test mau cho mot luat nghiep vu, viet tu kich ban Given-When-Then.

Chay o goc kho:   python -m pytest tests -v

Phan "Ma mau" ngay duoi chi de tep nay tu chay duoc khi kho chua co ma.
Trong do an, lop Don nam o src/ va tep test chi import vao, vi du
    from domain.don import Don, KhongHuyDuoc
Co test that cho luat cua nhom roi thi xoa tep nay. Cach viet: to tra cuu TC8.
"""
import pytest


# ---- Ma mau. Trong do an, phan nay nam o src/ ----

class KhongHuyDuoc(Exception):
    pass


class Don:
    def __init__(self, ma, trang_thai="cho_xac_nhan"):
        self.ma = ma
        self.trang_thai = trang_thai

    def huy(self, ly_do):
        if self.trang_thai != "cho_xac_nhan":
            raise KhongHuyDuoc("Quay da nhan don, khong huy duoc")
        self.trang_thai = "da_huy"
        self.ly_do_huy = ly_do


# ---- Test cho BR-03: quay da nhan don thi khach khong huy duoc ----

def test_BR03_quay_da_nhan_thi_khong_huy_duoc():
    # Arrange (Given): don DH-002 dang Da xac nhan
    don = Don("DH-002", trang_thai="da_xac_nhan")

    # Act (When): khach bam Huy
    with pytest.raises(KhongHuyDuoc) as loi:
        don.huy(ly_do="Doi y")

    # Assert (Then): bao loi, don van Da xac nhan
    assert str(loi.value) == "Quay da nhan don, khong huy duoc"
    assert don.trang_thai == "da_xac_nhan"


def test_BR03_quay_chua_nhan_thi_huy_duoc():
    # Arrange (Given): don DH-001 dang Cho xac nhan
    don = Don("DH-001")

    # Act (When): khach bam Huy, chon ly do "Doi y"
    don.huy(ly_do="Doi y")

    # Assert (Then): don chuyen sang Da huy
    assert don.trang_thai == "da_huy"
