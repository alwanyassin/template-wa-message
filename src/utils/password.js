// Utility untuk membuat password acak yang aman dan mudah dibaca (bebas karakter ambigu)

export function generateRandomPassword(length = 8, includeSpecial = false) {
  // Karakter yang mudah dibedakan (tanpa huruf l/I/O dan angka 0/1 untuk kenyamanan user)
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const numbers = '23456789';
  const specials = '!@#$%*';

  let pool = lower + upper + numbers;
  if (includeSpecial) {
    pool += specials;
  }

  // Pastikan minimal memiliki 1 huruf kecil, 1 huruf besar, dan 1 angka
  let password = [
    lower[Math.floor(Math.random() * lower.length)],
    upper[Math.floor(Math.random() * upper.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
  ];

  if (includeSpecial) {
    password.push(specials[Math.floor(Math.random() * specials.length)]);
  }

  // Isi sisa panjang password dari karakter pool
  while (password.length < length) {
    password.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  // Acak urutan karakter (Fisher-Yates shuffle)
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join('');
}
