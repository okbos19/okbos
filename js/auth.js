import { supabase } from "./supabase.js";

const form = document.querySelector("#loginForm");
const message = document.querySelector("#loginMessage");
const password = document.querySelector("#password");
const email = document.querySelector("#email");
const forgotPassword = document.querySelector("#forgotPassword");

const { data: { session } } = await supabase.auth.getSession();
if (session) location.href = "./index.html";

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "Memproses...";
  message.className = "message";

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value.trim(),
    password: password.value
  });

  if (error) {
    message.textContent = error.message;
    message.className = "message error";
    return;
  }

  location.href = "./index.html";
});

forgotPassword.addEventListener("click", async () => {
  const address = email.value.trim();
  if (!address) {
    message.textContent = "Masukkan email terlebih dahulu.";
    message.className = "message error";
    email.focus();
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(address, {
    redirectTo: `${location.origin}/reset-password.html`
  });

  message.textContent = error?.message || "Link reset password sudah dikirim.";
  message.className = `message ${error ? "error" : "success"}`;
});
