import { supabase } from "./supabase.js";

const roles = {
  OWNER: [
    "home",
    "transaksi",
    "pelanggan",
    "keuangan",
    "shift",
    "cash",
    "recon",
    "laporan",
    "settings"
  ],

  ADMIN: [
    "home",
    "transaksi",
    "pelanggan",
    "keuangan",
    "shift",
    "cash",
    "recon",
    "laporan"
  ],

  SUPERVISOR: [
    "home",
    "transaksi",
    "pelanggan",
    "keuangan",
    "shift",
    "cash",
    "recon",
    "laporan"
  ],

  CASHIER: [
    "home",
    "transaksi",
    "pelanggan",
    "shift",
    "cash"
  ]
};


/* =========================
   AUTH GUARD
========================= */

export async function guard() {
  try {
    const {
      data: { session },
      error
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Supabase session error:", error);
      return null;
    }

    if (!session) {
      const isPages = location.pathname.includes("/pages/");
      location.href = isPages
        ? "../login.html"
        : "./login.html";

      return null;
    }

    return session;

  } catch (error) {
    console.error("Guard error:", error);
    return null;
  }
}


/* =========================
   BOTTOM NAV
========================= */

export async function initNav(active) {

  const session = await guard();

  if (!session) return;


  /* Element halaman */

  const bottomNav =
    document.getElementById("bottomNav");

  const moreMenu =
    document.getElementById("moreMenu");


  if (!bottomNav) {
    console.error(
      "ERROR: #bottomNav tidak ditemukan."
    );
    return;
  }

  if (!moreMenu) {
    console.error(
      "ERROR: #moreMenu tidak ditemukan."
    );
    return;
  }


  /* =========================
     ROLE USER
  ========================= */

  let role = "CASHIER";

  try {

    const {
      data,
      error
    } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", session.user.id)
      .maybeSingle();

    if (error) {

      console.warn(
        "Tidak dapat mengambil role:",
        error.message
      );

    } else if (data && data.role) {

      role =
        String(data.role).toUpperCase();

    }

  } catch (error) {

    console.warn(
      "Role user gagal dibaca:",
      error
    );

  }


  /* =========================
     BASE URL
  ========================= */

  const isPages =
    location.pathname.includes("/pages/");

  const base =
    isPages ? "../" : "./";


  /* =========================
     MENU
  ========================= */

  const allowed =
    roles[role] || roles.CASHIER;


  const items = [

    [
      "home",
      "home",
      "Home",
      base + "index.html"
    ],

    [
      "transaksi",
      "receipt_long",
      "Transaksi",
      base + "pages/transaksi.html"
    ],

    [
      "pelanggan",
      "group",
      "Pelanggan",
      base + "pages/pelanggan.html"
    ],

    [
      "keuangan",
      "account_balance_wallet",
      "Keuangan",
      base + "pages/keuangan.html"
    ]

  ];


  const visibleItems =
    items.filter(item =>
      allowed.includes(item[0])
    );


  /* =========================
     RENDER BOTTOM NAV
  ========================= */

  bottomNav.innerHTML = `

    <div class="bottom-nav-inner">

      ${visibleItems.map(item => `

        <a
          class="nav-item ${
            active === item[0]
              ? "active"
              : ""
          }"
          href="${item[3]}"
        >

          <span class="material-symbols-rounded">
            ${item[1]}
          </span>

          ${item[2]}

        </a>

      `).join("")}


      <button
        type="button"
        class="nav-item"
        id="moreButton"
      >

        <span class="material-symbols-rounded">
          more_horiz
        </span>

        Lainnya

      </button>

    </div>

  `;


  /* =========================
     MORE MENU
  ========================= */

  moreMenu.innerHTML = `

    <a href="${base}pages/shift.html">
      Shift
    </a>

    <a href="${base}pages/cash-drawer.html">
      Cash Drawer
    </a>

    <a href="${base}pages/rekonsiliasi.html">
      Rekonsiliasi
    </a>

    <a href="${base}pages/laporan.html">
      Laporan
    </a>

    <a href="${base}pages/pengaturan.html">
      Pengaturan
    </a>

    <button
      type="button"
      id="logout"
      class="logout"
    >
      Keluar
    </button>

  `;


  /* =========================
     BUTTON
  ========================= */

  const moreButton =
    document.getElementById("moreButton");

  const logout =
    document.getElementById("logout");


  /* =========================
     MORE BUTTON
  ========================= */

  if (moreButton) {

    moreButton.onclick = event => {

      event.stopPropagation();

      moreMenu.classList.toggle("show");

    };

  }


  /* =========================
     LOGOUT
  ========================= */

  if (logout) {

    logout.onclick = async () => {

      logout.disabled = true;

      try {

        const {
          error
        } = await supabase.auth.signOut();

        if (error) {

          console.error(
            "Logout error:",
            error
          );

          logout.disabled = false;

          return;
        }

        location.href =
          base + "login.html";

      } catch (error) {

        console.error(
          "Logout exception:",
          error
        );

        logout.disabled = false;

      }

    };

  }


  /* =========================
     TUTUP MORE MENU
  ========================= */

  if (!window.__okbosMoreMenuListener) {

    document.addEventListener(
      "click",
      event => {

        if (
          moreMenu.classList.contains("show") &&
          !moreMenu.contains(event.target) &&
          !moreButton?.contains(event.target)
        ) {

          moreMenu.classList.remove("show");

        }

      }
    );

    window.__okbosMoreMenuListener = true;

  }

}