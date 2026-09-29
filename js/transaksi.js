import { initNav } from "../js/app.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await initNav("transaksi");
  } catch (error) {
    console.error("Transaksi init error:", error);
  }
});