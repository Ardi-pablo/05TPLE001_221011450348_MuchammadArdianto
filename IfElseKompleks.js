function prosesTransaksi(user, detailOrder) {
    // 1. Pengecekan Awal dengan if-else
    if (!user.isAktif) {
        return "Transaksi Gagal: Akun Anda ditangguhkan.";
    }
    if (detailOrder.totalBelanja <= 0) {
        return "Transaksi Gagal: Total belanja tidak valid.";
    }

    let totalAkhir = detailOrder.totalBelanja;

    // 2. Logika if-else Kompleks untuk Diskon Promo
    if (detailOrder.kodePromo) {
        if (detailOrder.kodePromo === "DISKON30" && detailOrder.totalBelanja >= 100000) {
            totalAkhir *= 0.7; // Potongan 30%
        } else if (detailOrder.kodePromo === "GRATISONGKIR" && detailOrder.jarakKirim < 10) {
            console.log("Mendapatkan gratis ongkir!");
        } else {
            console.log("Kode promo tidak berlaku untuk syarat ini.");
        }
    }

    // 3. Struktur Switch Case Kompleks berdasarkan Metode Pembayaran
    switch (detailOrder.metodePembayaran) {
        case "Transfer_Bank":
            if (user.saldoBank < totalAkhir) {
                return `Gagal: Saldo bank tidak cukup. Kurang: ${totalAkhir - user.saldoBank}`;
            }
            user.saldoBank -= totalAkhir;
            return `Sukses: Dibayar menggunakan Bank. Sisa saldo: ${user.saldoBank}`;

        case "E_Wallet":
            // Switch di dalam switch / Kombinasi if
            if (!user.isKycVerified && totalAkhir > 2000000) {
                return "Gagal: Batas maksimum E-Wallet non-KYC adalah Rp 2.000.000";
            }
            if (user.saldoEWallet < totalAkhir) {
                return "Gagal: Saldo E-Wallet tidak cukup.";
            }
            user.saldoEWallet -= totalAkhir;
            return "Sukses: Dibayar menggunakan E-Wallet.";

        case "Kartu_Kredit":
            if (user.limitKredit < totalAkhir) {
                return "Gagal: Transaksi melebihi limit kartu kredit.";
            }
            user.limitKredit -= totalAkhir;
            return "Sukses: Transaksi kartu kredit berhasil diproses.";

        default:
            return "Transaksi Gagal: Metode pembayaran tidak dikenali.";
    }
}

// Contoh Data Pengguna
const userAndi = { isAktif: true, saldoBank: 500000, saldoEWallet: 150000, isKycVerified: false };
const order1 = { totalBelanja: 200000, kodePromo: "DISKON30", metodePembayaran: "Transfer_Bank" };

console.log(prosesTransaksi(userAndi, order1)); 
// Output: Sukses: Dibayar menggunakan Bank. Sisa saldo: 360000 (Setelah diskon 30%)